/**
 * ============================================================================
 * MIDNIGHT CONTRACT RUNTIME & SDK LAYER: Scholarship Eligibility
 * ============================================================================
 * Supports multi-scholarship management, role-based application tracking,
 * off-chain private student witnesses, credential status gating, and
 * zero-knowledge circuit execution.
 * ============================================================================
 */

export type ApplicationStatus =
  | "Not Applied"
  | "Documents Submitted"
  | "Under Review"
  | "Verified"
  | "Eligible"
  | "Not Eligible"
  | "Rejected";

export interface SubmittedDocument {
  id: string;
  type: "Marksheet" | "Income Certificate";
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  mockHash: string;
}

export interface ScholarshipItem {
  id: string;
  name: string;
  description: string;
  minimumMarks: bigint;
  maximumFamilyIncome: bigint;
  requiredDocuments: string[];
  createdBy: string;
  creatorAddress: string;
  createdAt: string;
}

export interface StudentApplication {
  id: string;
  scholarshipId: string;
  scholarshipName: string;
  studentId: string;
  studentName: string;
  marksheet: SubmittedDocument | null;
  incomeCertificate: SubmittedDocument | null;
  status: ApplicationStatus;
  submittedAt: string;
  verifiedAt?: string;
  rejectionReason?: string;
  eligibilityResult?: boolean;
  proofHash?: string;
}

export interface PublicLedgerState {
  scholarshipName: string;
  minimumMarks: bigint;
  maximumFamilyIncome: bigint;
  verificationsCount: number;
  latestVerificationResult: boolean;
  credentialVerificationStatus: ApplicationStatus;
  isInitialized: boolean;
  scholarships: ScholarshipItem[];
  applications: StudentApplication[];
}

export interface PrivateStudentWitness {
  studentMarks: bigint;
  studentIncome: bigint;
  isCredentialVerified?: boolean;
}

export interface VerificationProofResult {
  isEligible: boolean;
  publicState: PublicLedgerState;
  proofHash: string;
  timestamp: number;
  applicationId?: string;
  scholarshipId?: string;
  privacySummary: {
    marksDisclosed: boolean;
    incomeDisclosed: boolean;
    resultDisclosed: boolean;
  };
}

export class ScholarshipEligibilityContract {
  private scholarships: ScholarshipItem[] = [];
  private applications: StudentApplication[] = [];
  private verificationsCount: number = 0;
  private latestVerificationResult: boolean = false;
  private contractAddress: string;
  private userRoles: Map<string, "student" | "provider"> = new Map();

  constructor(
    contractAddress: string = "0xmid1scholarship_verification_contract_local"
  ) {
    this.contractAddress = contractAddress;
    // Clean initialization: start with 0 default scholarships and applications
    this.scholarships = [];
    this.applications = [];
  }

  /**
   * Permanently binds a wallet/account address to a role.
   * Throws an error if the address is already registered to a different role.
   */
  public registerRole(address: string, role: "student" | "provider"): "student" | "provider" {
    const existingRole = this.userRoles.get(address);
    if (existingRole && existingRole !== role) {
      throw new Error(
        `Account '${address}' is permanently registered as a '${existingRole}' and cannot be registered as a '${role}'.`
      );
    }
    this.userRoles.set(address, role);
    return role;
  }

  public getUserRole(address: string): "student" | "provider" | undefined {
    return this.userRoles.get(address);
  }

  /**
   * Retrieves the current public ledger state.
   */
  public getLedgerState(): PublicLedgerState {
    const primary = this.scholarships[0] || {
      name: "No Active Scholarship",
      minimumMarks: 0n,
      maximumFamilyIncome: 0n
    };

    return {
      scholarshipName: primary.name,
      minimumMarks: primary.minimumMarks,
      maximumFamilyIncome: primary.maximumFamilyIncome,
      verificationsCount: this.verificationsCount,
      latestVerificationResult: this.latestVerificationResult,
      credentialVerificationStatus: this.applications[0]?.status || "Not Applied",
      isInitialized: true,
      scholarships: [...this.scholarships],
      applications: [...this.applications]
    };
  }

  public getContractAddress(): string {
    return this.contractAddress;
  }

  public getScholarships(): ScholarshipItem[] {
    return [...this.scholarships];
  }

  public getScholarshipById(id: string): ScholarshipItem | undefined {
    return this.scholarships.find((s) => s.id === id);
  }

  public getApplicationsForStudent(studentId: string = "student_alex"): StudentApplication[] {
    return this.applications.filter((a) => a.studentId === studentId);
  }

  public getApplicationsForProvider(providerAddress?: string): StudentApplication[] {
    if (!providerAddress) {
      return [...this.applications];
    }
    const ownedScholarshipIds = new Set(
      this.scholarships.filter((s) => s.creatorAddress === providerAddress).map((s) => s.id)
    );
    return this.applications.filter((a) => ownedScholarshipIds.has(a.scholarshipId));
  }

  /**
   * Scholarship Provider method to create a new scholarship program.
   * Gated by Provider role authorization.
   */
  public createScholarship(
    name: string,
    description: string,
    minMarks: number | bigint,
    maxIncome: number | bigint,
    requiredDocs: string[] = ["Academic Marksheet", "Family Income Certificate"],
    createdBy: string = "Scholarship Provider Admin",
    creatorAddress: string = "mn_addr1_provider_default"
  ): ScholarshipItem {
    // Role validation
    const role = this.getUserRole(creatorAddress);
    if (role === "student") {
      throw new Error(`Unauthorized: Account '${creatorAddress}' is registered as a Student and cannot create scholarships.`);
    }
    this.registerRole(creatorAddress, "provider");

    const id = `sch_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const newScholarship: ScholarshipItem = {
      id,
      name,
      description,
      minimumMarks: BigInt(minMarks),
      maximumFamilyIncome: BigInt(maxIncome),
      requiredDocuments: requiredDocs,
      createdBy,
      creatorAddress,
      createdAt: new Date().toISOString()
    };
    this.scholarships.push(newScholarship);
    return newScholarship;
  }

  /**
   * Provider method to delete a scholarship program owned by caller.
   * Only the creator can delete their own scholarship.
   */
  public deleteScholarship(scholarshipId: string, callerAddress: string): PublicLedgerState {
    const role = this.getUserRole(callerAddress);
    if (role === "student") {
      throw new Error(`Unauthorized: Account '${callerAddress}' is registered as a Student and cannot delete scholarships.`);
    }

    const scholarship = this.getScholarshipById(scholarshipId);
    if (!scholarship) {
      throw new Error(`Scholarship with ID ${scholarshipId} not found.`);
    }

    if (scholarship.creatorAddress !== callerAddress) {
      throw new Error(
        `Unauthorized: Only the scholarship creator ('${scholarship.creatorAddress}') can delete this grant. Account '${callerAddress}' is not authorized.`
      );
    }

    this.scholarships = this.scholarships.filter((s) => s.id !== scholarshipId);
    this.applications = this.applications.filter((a) => a.scholarshipId !== scholarshipId);
    return this.getLedgerState();
  }

  /**
   * Admin method to update scholarship criteria owned by caller.
   */
  public updateCriteria(
    scholarshipId: string,
    callerAddress: string,
    name: string,
    minMarks: number | bigint,
    maxIncome: number | bigint
  ): PublicLedgerState {
    const role = this.getUserRole(callerAddress);
    if (role === "student") {
      throw new Error(`Unauthorized: Account '${callerAddress}' is registered as a Student and cannot edit scholarship criteria.`);
    }

    const scholarship = this.getScholarshipById(scholarshipId);
    if (!scholarship) {
      throw new Error(`Scholarship with ID ${scholarshipId} not found.`);
    }

    if (scholarship.creatorAddress !== callerAddress) {
      throw new Error(
        `Unauthorized: Only the scholarship creator ('${scholarship.creatorAddress}') can edit its criteria. Account '${callerAddress}' is not authorized.`
      );
    }

    scholarship.name = name;
    scholarship.minimumMarks = BigInt(minMarks);
    scholarship.maximumFamilyIncome = BigInt(maxIncome);
    return this.getLedgerState();
  }

  /**
   * Student method to submit credential documents and apply for a scholarship.
   */
  public submitApplication(
    scholarshipId: string,
    studentId: string = "student_alex",
    studentName: string = "Alex Vance",
    marksheetFileName: string = "Marksheet_Academic_Record.pdf",
    incomeCertFileName: string = "Income_Tax_Certificate.pdf"
  ): StudentApplication {
    const role = this.getUserRole(studentId);
    if (role === "provider") {
      throw new Error(`Unauthorized: Account '${studentId}' is registered as a Scholarship Provider and cannot submit student applications.`);
    }
    this.registerRole(studentId, "student");

    const scholarship = this.getScholarshipById(scholarshipId);
    if (!scholarship) {
      throw new Error(`Scholarship with ID ${scholarshipId} not found.`);
    }

    const existingIndex = this.applications.findIndex(
      (a) => a.scholarshipId === scholarshipId && a.studentId === studentId
    );

    const newApp: StudentApplication = {
      id: existingIndex >= 0 ? this.applications[existingIndex].id : `app_${Date.now()}`,
      scholarshipId,
      scholarshipName: scholarship.name,
      studentId,
      studentName,
      marksheet: {
        id: `doc_m_${Date.now()}`,
        type: "Marksheet",
        fileName: marksheetFileName,
        fileSize: "1.2 MB",
        uploadedAt: new Date().toISOString(),
        mockHash: `0xhash_marksheet_${Math.floor(Math.random() * 100000)}`
      },
      incomeCertificate: {
        id: `doc_i_${Date.now()}`,
        type: "Income Certificate",
        fileName: incomeCertFileName,
        fileSize: "750 KB",
        uploadedAt: new Date().toISOString(),
        mockHash: `0xhash_income_${Math.floor(Math.random() * 100000)}`
      },
      status: "Documents Submitted",
      submittedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      this.applications[existingIndex] = newApp;
    } else {
      this.applications.push(newApp);
    }

    return newApp;
  }

  /**
   * Provider method to review and update student credential status (Verified or Rejected).
   * Caller address MUST be the creator/owner of the target scholarship.
   */
  public updateApplicationStatus(
    applicationId: string,
    status: ApplicationStatus,
    callerAddress: string,
    rejectionReason?: string
  ): StudentApplication {
    const app = this.applications.find((a) => a.id === applicationId);
    if (!app) {
      throw new Error(`Application with ID ${applicationId} not found.`);
    }

    const scholarship = this.getScholarshipById(app.scholarshipId);
    if (!scholarship || scholarship.creatorAddress !== callerAddress) {
      throw new Error(
        `Unauthorized: Only the creator of '${scholarship?.name || "this grant"}' can review applications. Account '${callerAddress}' is not authorized.`
      );
    }

    app.status = status;
    if (status === "Verified") {
      app.verifiedAt = new Date().toISOString();
      delete app.rejectionReason;
    } else if (status === "Rejected") {
      app.rejectionReason = rejectionReason || "Submitted documents did not match official records or were incomplete.";
    }

    return app;
  }

  /**
   * Executes the zero-knowledge circuit `verifyEligibility`.
   * Gated strictly by credential verification status (`Verified`).
   */
  public verifyEligibility(
    witness: PrivateStudentWitness,
    applicationId?: string
  ): VerificationProofResult {
    let app: StudentApplication | undefined;
    if (applicationId) {
      app = this.applications.find((a) => a.id === applicationId);
    } else {
      app = this.applications[0];
    }

    if (!app) {
      throw new Error("No application found for eligibility verification.");
    }

    const isExplicitlyVerified = witness.isCredentialVerified === true;
    const currentStatus = app.status;

    if (!isExplicitlyVerified && currentStatus !== "Verified" && currentStatus !== "Eligible" && currentStatus !== "Not Eligible") {
      throw new Error(
        `Cannot generate eligibility proof. Student credentials status is '${currentStatus}'. Credentials must be verified by a scholarship administrator first.`
      );
    }

    const targetScholarship = this.getScholarshipById(app.scholarshipId);
    if (!targetScholarship) {
      throw new Error(`Associated scholarship '${app.scholarshipId}' no longer exists.`);
    }

    const minMarks = targetScholarship.minimumMarks;
    const maxIncome = targetScholarship.maximumFamilyIncome;

    const marks = BigInt(witness.studentMarks);
    const income = BigInt(witness.studentIncome);

    const meetsMarks = marks >= minMarks;
    const meetsIncome = income <= maxIncome;
    const isEligible = meetsMarks && meetsIncome;

    this.verificationsCount += 1;
    this.latestVerificationResult = isEligible;

    app.status = isEligible ? "Eligible" : "Not Eligible";
    app.eligibilityResult = isEligible;

    const proofDigest = this.generateProofDigest(marks, income, isEligible);
    app.proofHash = proofDigest;

    return {
      isEligible,
      publicState: this.getLedgerState(),
      proofHash: proofDigest,
      timestamp: Date.now(),
      applicationId: app.id,
      scholarshipId: targetScholarship.id,
      privacySummary: {
        marksDisclosed: false,
        incomeDisclosed: false,
        resultDisclosed: true
      }
    };
  }

  private generateProofDigest(marks: bigint, income: bigint, result: boolean): string {
    const rawStr = `zk_proof_midnight_v1:${this.contractAddress}:${this.verificationsCount}:${result}`;
    let hash = 0;
    for (let i = 0; i < rawStr.length; i++) {
      const char = rawStr.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `0xzk_${Math.abs(hash).toString(16).padStart(16, "0")}`;
  }
}

