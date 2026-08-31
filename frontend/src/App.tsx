import React, { useState, useEffect } from "react";
import {
  ScholarshipEligibilityContract,
  VerificationProofResult,
  ScholarshipItem,
  StudentApplication,
  ApplicationStatus
} from "../../src/contract";
import { MidnightWalletAdapter } from "../../src/wallet";
import { Header } from "./components/Header";
import { RoleSelector, UserRole } from "./components/RoleSelector";
import { StudentPortal } from "./components/StudentPortal";
import { ProviderPortal } from "./components/ProviderPortal";
import { LedgerInspector } from "./components/LedgerInspector";
import { PrivacyModal } from "./components/PrivacyModal";

const walletAdapter = new MidnightWalletAdapter();

export function App() {
  const [contract] = useState<ScholarshipEligibilityContract>(
    () => new ScholarshipEligibilityContract()
  );

  const [walletState, setWalletState] = useState(() => walletAdapter.getState());
  const [currentRole, setCurrentRole] = useState<UserRole>(null);
  const [activeTab, setActiveTab] = useState<"student" | "provider" | "inspector">("student");
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);

  const [publicState, setPublicState] = useState(() => contract.getLedgerState());
  const [scholarships, setScholarships] = useState<ScholarshipItem[]>(() => contract.getScholarships());
  const [applications, setApplications] = useState<StudentApplication[]>(() => contract.getApplicationsForProvider());

  const refreshState = () => {
    setPublicState(contract.getLedgerState());
    setScholarships(contract.getScholarships());
    setApplications(contract.getApplicationsForProvider());
  };

  // Sync role whenever wallet address changes
  useEffect(() => {
    const address = walletState.address;
    if (!address) {
      setCurrentRole(null);
      return;
    }

    // Check if contract or localStorage has role registered for this address
    const registeredContractRole = contract.getUserRole(address);
    const storedRole = (localStorage.getItem(`role_${address}`) as UserRole) || registeredContractRole;

    if (storedRole) {
      try {
        contract.registerRole(address, storedRole);
      } catch (err) {
        console.warn(err);
      }
      setCurrentRole(storedRole);
      setActiveTab(storedRole === "student" ? "student" : "provider");
    } else {
      setCurrentRole(null);
    }
  }, [walletState.address, contract]);

  const handleSelectAccount = (newAddress: string) => {
    const updated = walletAdapter.switchAccount(newAddress);
    setWalletState(updated);
  };

  const handleSelectRole = (role: "student" | "provider") => {
    const address = walletState.address || "0xaddr_provider_alpha";
    try {
      contract.registerRole(address, role);
      localStorage.setItem(`role_${address}`, role);
      setCurrentRole(role);
      setActiveTab(role === "student" ? "student" : "provider");
    } catch (err: any) {
      alert(err.message || "Failed to register role for this account.");
    }
  };

  const handleCreateScholarship = (
    name: string,
    description: string,
    minMarks: number,
    maxIncome: number
  ) => {
    const address = walletState.address || "0xaddr_provider_alpha";
    const displayName = address.includes("beta") ? "Provider Beta Org" : "Provider Alpha Org";
    contract.createScholarship(name, description, minMarks, maxIncome, ["Academic Marksheet", "Family Income Certificate"], displayName, address);
    refreshState();
  };

  const handleDeleteScholarship = (scholarshipId: string) => {
    const address = walletState.address || "0xaddr_provider_alpha";
    try {
      contract.deleteScholarship(scholarshipId, address);
      refreshState();
    } catch (err: any) {
      alert(err.message || "Unauthorized deletion attempt.");
    }
  };

  const handleSubmitApplication = (
    scholarshipId: string,
    marksheetFileName: string,
    incomeCertFileName: string
  ) => {
    const address = walletState.address || "0xaddr_student_alex";
    contract.submitApplication(
      scholarshipId,
      address,
      "Alex Vance (Student)",
      marksheetFileName,
      incomeCertFileName
    );
    refreshState();
  };

  const handleUpdateApplicationStatus = (
    applicationId: string,
    status: ApplicationStatus,
    reason?: string
  ) => {
    const address = walletState.address || "0xaddr_provider_alpha";
    try {
      contract.updateApplicationStatus(applicationId, status, address, reason);
      refreshState();
    } catch (err: any) {
      alert(err.message || "Unauthorized review attempt.");
    }
  };

  const handleRunVerification = (
    applicationId: string,
    marks: number,
    income: number
  ): VerificationProofResult => {
    const result = contract.verifyEligibility(
      {
        studentMarks: BigInt(marks),
        studentIncome: BigInt(income)
      },
      applicationId
    );
    refreshState();
    return result;
  };

  const handleConnectWallet = async () => {
    const updated = await walletAdapter.connect();
    setWalletState(updated);
  };

  const handleDisconnectWallet = () => {
    const updated = walletAdapter.disconnect();
    setWalletState(updated);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-950 text-slate-100">
      
      {/* Header */}
      <Header
        currentRole={currentRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
        walletState={walletState}
        onConnectWallet={handleConnectWallet}
        onDisconnectWallet={handleDisconnectWallet}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* If no role is selected yet for this account, show Role Selector */}
        {!currentRole ? (
          <RoleSelector onSelectRole={handleSelectRole} />
        ) : (
          <>
            {activeTab === "student" && (
              <StudentPortal
                scholarships={scholarships}
                applications={applications.filter((a) => a.studentId === walletState.address)}
                onSubmitApplication={handleSubmitApplication}
                onRunVerification={handleRunVerification}
                onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
              />
            )}

            {activeTab === "provider" && (
              <ProviderPortal
                scholarships={scholarships}
                applications={applications}
                currentWalletAddress={walletState.address || "0xaddr_provider_alpha"}
                onCreateScholarship={handleCreateScholarship}
                onDeleteScholarship={handleDeleteScholarship}
                onUpdateStatus={handleUpdateApplicationStatus}
                onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
              />
            )}

            {activeTab === "inspector" && (
              <LedgerInspector
                publicState={publicState}
                contractAddress={contract.getContractAddress()}
              />
            )}
          </>
        )}

      </main>

      {/* Privacy & Technology Explanation Modal */}
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Clean Footer with Optional Developer Link */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500 space-y-1">
        <div className="flex items-center justify-center space-x-3">
          <span className="font-semibold text-slate-400">Private Scholarship Portal</span>
          <span>•</span>
          <button
            onClick={() => setIsPrivacyModalOpen(true)}
            className="text-indigo-400 hover:underline"
          >
            How Privacy Works
          </button>
          <span>•</span>
          <button
            onClick={() => {
              setActiveTab("inspector");
            }}
            className="text-slate-400 hover:text-white hover:underline font-mono text-[11px]"
          >
            Developer Ledger Inspector
          </button>
        </div>
      </footer>

    </div>
  );
}

export default App;

