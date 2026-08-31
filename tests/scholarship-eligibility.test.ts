/**
 * ============================================================================
 * TEST SUITE: Private Scholarship Eligibility & Role/Ownership Layer
 * ============================================================================
 * Comprehensive unit tests covering permanent role binding, provider
 * scholarship ownership, authorized deletion, non-owner restrictions, and ZK proof execution.
 * ============================================================================
 */

import { describe, it, expect, beforeEach } from "vitest";
import { ScholarshipEligibilityContract } from "../src/contract.js";

describe("Private Scholarship Eligibility & Credential Verification Contract", () => {
  let contract: ScholarshipEligibilityContract;

  beforeEach(() => {
    contract = new ScholarshipEligibilityContract();
  });

  // --------------------------------------------------------------------------
  // TEST 1 — Fresh Application State (Zero Default/Demo Scholarships)
  // --------------------------------------------------------------------------
  it("TEST 1 — Fresh State: Fresh contract instance MUST start with 0 default/demo scholarships", () => {
    const scholarships = contract.getScholarships();
    expect(scholarships.length).toBe(0);

    const ledger = contract.getLedgerState();
    expect(ledger.scholarships.length).toBe(0);
    expect(ledger.applications.length).toBe(0);
  });

  // --------------------------------------------------------------------------
  // TEST 2 — Permanent Role Locking: Student -> Provider Prohibited
  // --------------------------------------------------------------------------
  it("TEST 2 — Permanent Role Locking: Student account MUST NOT be allowed to become a Scholarship Provider later", () => {
    const studentAddr = "0xaddr_student_alex";

    // First register as Student
    contract.registerRole(studentAddr, "student");
    expect(contract.getUserRole(studentAddr)).toBe("student");

    // Attempting to re-register or switch to provider must throw an error
    expect(() => {
      contract.registerRole(studentAddr, "provider");
    }).toThrowError(/permanently registered as a 'student'/);
  });

  // --------------------------------------------------------------------------
  // TEST 3 — Permanent Role Locking: Provider -> Student Prohibited
  // --------------------------------------------------------------------------
  it("TEST 3 — Permanent Role Locking: Scholarship Provider account MUST NOT be allowed to become a Student later", () => {
    const providerAddr = "0xaddr_provider_alpha";

    // First register as Provider
    contract.registerRole(providerAddr, "provider");
    expect(contract.getUserRole(providerAddr)).toBe("provider");

    // Attempting to re-register or switch to student must throw an error
    expect(() => {
      contract.registerRole(providerAddr, "student");
    }).toThrowError(/permanently registered as a 'provider'/);
  });

  // --------------------------------------------------------------------------
  // TEST 4 — Scholarship Owner Can Delete Their Own Scholarship
  // --------------------------------------------------------------------------
  it("TEST 4 — Scholarship Ownership: Provider can successfully delete their own scholarship program", () => {
    const providerAddr = "0xaddr_provider_alpha";

    const sch = contract.createScholarship(
      "Alpha Merit Grant 2026",
      "Academic scholarship by Provider Alpha",
      75n,
      500000n,
      ["Academic Marksheet", "Family Income Certificate"],
      "Provider Alpha",
      providerAddr
    );

    expect(contract.getScholarships().length).toBe(1);

    // Owner deletes their own scholarship
    contract.deleteScholarship(sch.id, providerAddr);

    expect(contract.getScholarships().length).toBe(0);
    expect(contract.getScholarshipById(sch.id)).toBeUndefined();
  });

  // --------------------------------------------------------------------------
  // TEST 5 — Different Provider Cannot Delete Another Provider's Scholarship
  // --------------------------------------------------------------------------
  it("TEST 5 — Ownership Security: Different provider MUST NOT be able to delete another provider's scholarship", () => {
    const providerAlpha = "0xaddr_provider_alpha";
    const providerBeta = "0xaddr_provider_beta";

    const sch = contract.createScholarship(
      "Alpha Foundation Award",
      "Grant created by Provider Alpha",
      80n,
      600000n,
      ["Academic Marksheet", "Family Income Certificate"],
      "Provider Alpha",
      providerAlpha
    );

    // Provider Beta attempts to delete Provider Alpha's scholarship
    expect(() => {
      contract.deleteScholarship(sch.id, providerBeta);
    }).toThrowError(/Unauthorized: Only the scholarship creator/);

    // Ensure scholarship remains intact
    expect(contract.getScholarshipById(sch.id)).toBeDefined();
    expect(contract.getScholarships().length).toBe(1);
  });

  // --------------------------------------------------------------------------
  // TEST 6 — Different Provider Cannot Edit Another Provider's Scholarship
  // --------------------------------------------------------------------------
  it("TEST 6 — Ownership Security: Different provider MUST NOT be able to edit another provider's scholarship criteria", () => {
    const providerAlpha = "0xaddr_provider_alpha";
    const providerBeta = "0xaddr_provider_beta";

    const sch = contract.createScholarship(
      "Alpha STEM Fellowship",
      "Grant created by Provider Alpha",
      85n,
      400000n,
      ["Academic Marksheet", "Family Income Certificate"],
      "Provider Alpha",
      providerAlpha
    );

    // Provider Beta attempts to edit Provider Alpha's criteria
    expect(() => {
      contract.updateCriteria(sch.id, providerBeta, "Hijacked Title", 50n, 1000000n);
    }).toThrowError(/Unauthorized: Only the scholarship creator/);

    // Ensure criteria remains unchanged
    const original = contract.getScholarshipById(sch.id);
    expect(original?.name).toBe("Alpha STEM Fellowship");
    expect(original?.minimumMarks).toBe(85n);
  });

  // --------------------------------------------------------------------------
  // TEST 7 — Students Cannot Create or Delete Scholarships
  // --------------------------------------------------------------------------
  it("TEST 7 — Role Enforcement: Student account MUST NOT be able to create or delete scholarships", () => {
    const studentAddr = "0xaddr_student_alex";
    const providerAddr = "0xaddr_provider_alpha";

    contract.registerRole(studentAddr, "student");

    // Student attempts to create a scholarship
    expect(() => {
      contract.createScholarship(
        "Fake Student Grant",
        "Unauthorized grant",
        50n,
        1000000n,
        [],
        "Alex Vance",
        studentAddr
      );
    }).toThrowError(/registered as a Student and cannot create scholarships/);

    // Provider creates a legitimate scholarship
    const sch = contract.createScholarship(
      "Legitimate Provider Grant",
      "Valid grant",
      70n,
      500000n,
      [],
      "Provider Alpha",
      providerAddr
    );

    // Student attempts to delete provider's scholarship
    expect(() => {
      contract.deleteScholarship(sch.id, studentAddr);
    }).toThrowError(/Unauthorized/);
  });

  // --------------------------------------------------------------------------
  // TEST 8 — Full Application & ZK Eligibility Verification Lifecycle
  // --------------------------------------------------------------------------
  it("TEST 8 — Lifecycle: Full flow (Provider creates -> Student applies -> Provider verifies -> Student proves ZK eligibility)", () => {
    const providerAddr = "0xaddr_provider_alpha";
    const studentAddr = "0xaddr_student_alex";

    // 1. Provider creates scholarship
    const sch = contract.createScholarship(
      "National Science Grant 2026",
      "Full merit grant for science students",
      75n,
      500000n,
      ["Academic Marksheet", "Family Income Certificate"],
      "National Science Foundation",
      providerAddr
    );

    // 2. Student applies
    const app = contract.submitApplication(
      sch.id,
      studentAddr,
      "Alex Vance",
      "Marksheet.pdf",
      "IncomeCert.pdf"
    );
    expect(app.status).toBe("Documents Submitted");

    // Unverified gating assertion
    expect(() => {
      contract.verifyEligibility({ studentMarks: 85n, studentIncome: 300000n }, app.id);
    }).toThrowError(/Credentials must be verified by a scholarship administrator first/);

    // 3. Provider verifies application credentials
    contract.updateApplicationStatus(app.id, "Verified", providerAddr);
    expect(app.status).toBe("Verified");

    // 4. Student evaluates off-chain witness & executes ZK proof
    const result = contract.verifyEligibility(
      { studentMarks: 85n, studentIncome: 300000n },
      app.id
    );

    expect(result.isEligible).toBe(true);
    expect(result.proofHash).toMatch(/^0xzk_/);
    expect(result.privacySummary.marksDisclosed).toBe(false);
    expect(result.privacySummary.incomeDisclosed).toBe(false);
    expect(result.privacySummary.resultDisclosed).toBe(true);
  });

  // --------------------------------------------------------------------------
  // TEST 9 — Non-Owner Provider Cannot Review Another Provider's Applications
  // --------------------------------------------------------------------------
  it("TEST 9 — Ownership Security: Provider B MUST NOT be allowed to review or verify applications for Provider A's scholarship", () => {
    const providerAlpha = "0xaddr_provider_alpha";
    const providerBeta = "0xaddr_provider_beta";
    const studentAddr = "0xaddr_student_alex";

    const sch = contract.createScholarship(
      "Alpha Fellowship 2026",
      "Created by Alpha",
      70n,
      500000n,
      [],
      "Provider Alpha",
      providerAlpha
    );

    const app = contract.submitApplication(sch.id, studentAddr, "Alex Vance");

    // Provider Beta attempts to verify application for Provider Alpha's scholarship
    expect(() => {
      contract.updateApplicationStatus(app.id, "Verified", providerBeta);
    }).toThrowError(/Unauthorized: Only the creator of/);

    expect(app.status).toBe("Documents Submitted");
  });
});

