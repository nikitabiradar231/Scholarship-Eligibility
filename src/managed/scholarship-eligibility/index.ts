/**
 * ============================================================================
 * MIDNIGHT MANAGED CONTRACT ARTIFACTS & TYPESCRIPT BINDINGS
 * ============================================================================
 * Generated from `contracts/scholarship-eligibility.compact` for integration
 * with `@midnight-ntwrk/compact-runtime` and `@midnight-ntwrk/midnight-js-contracts`.
 * ============================================================================
 */

export interface PublicLedgerState {
  scholarshipName: string;
  minimumMarks: bigint;
  maximumFamilyIncome: bigint;
  creatorAddress: string;
  credentialVerificationStatus: string;
  verificationsCount: bigint;
  latestVerificationResult: boolean;
  isInitialized: boolean;
}

export interface PrivateWitnesses {
  studentMarks: () => bigint;
  studentIncome: () => bigint;
  isCredentialVerified: () => boolean;
  callerAddress: () => string;
  callerRole: () => "student" | "provider";
}

export interface ContractCircuits {
  verifyEligibility: () => Promise<boolean>;
  updateCredentialStatus: (newStatus: string) => Promise<void>;
  updateScholarshipCriteria: (newName: string, newMinMarks: bigint, newMaxIncome: bigint) => Promise<void>;
}

export const COMPACT_CONTRACT_METADATA = {
  contractName: "ScholarshipEligibilityContract",
  version: "0.20.0",
  sourcePath: "contracts/scholarship-eligibility.compact",
  compilerVersion: "compactc-0.20",
  zkirPath: "src/managed/scholarship-eligibility/scholarship_eligibility.zkir"
};
