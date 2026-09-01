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
import { WalletConnectModal } from "./components/WalletConnectModal";
import { UserProfileModal } from "./components/UserProfileModal";
import { Wallet } from "lucide-react";

const walletAdapter = new MidnightWalletAdapter();

export function App() {
  const [contract] = useState<ScholarshipEligibilityContract>(
    () => new ScholarshipEligibilityContract()
  );

  const [walletState, setWalletState] = useState(() => walletAdapter.getState());
  const [currentRole, setCurrentRole] = useState<UserRole>(null);
  const [activeTab, setActiveTab] = useState<"student" | "provider" | "inspector">("student");
  
  const [userName, setUserName] = useState<string>(() => {
    const addr = walletAdapter.getState().address;
    return addr ? localStorage.getItem(`username_${addr}`) || "" : "";
  });

  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  const [publicState, setPublicState] = useState(() => contract.getLedgerState());
  const [scholarships, setScholarships] = useState<ScholarshipItem[]>(() => contract.getScholarships());
  const [applications, setApplications] = useState<StudentApplication[]>(() => contract.getApplicationsForProvider());

  const refreshState = () => {
    contract.loadFromStorage();
    setPublicState(contract.getLedgerState());
    setScholarships(contract.getScholarships());
    setApplications(contract.getApplicationsForProvider());
  };

  useEffect(() => {
    refreshState();
  }, [activeTab, currentRole, walletState.address]);

  useEffect(() => {
    const handleStorageChange = () => {
      refreshState();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Sync role and username whenever wallet address changes
  useEffect(() => {
    const address = walletState.address;
    if (!address) {
      setCurrentRole(null);
      setUserName("");
      return;
    }

    const savedName = localStorage.getItem(`username_${address}`);
    setUserName(savedName || "");

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

  const handleSaveUserName = (newName: string) => {
    const address = walletState.address;
    if (address) {
      localStorage.setItem(`username_${address}`, newName);
      setUserName(newName);
    }
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
    const displayName = userName || (address.includes("beta") ? "Provider Beta Org" : "Provider Admin Org");
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
  ): boolean => {
    const address = walletState.address || "0xaddr_student_alex";
    const displayName = userName ? `${userName} (Student)` : `Student (${address.slice(0, 8)})`;
    try {
      contract.submitApplication(
        scholarshipId,
        address,
        displayName,
        marksheetFileName,
        incomeCertFileName
      );
      refreshState();
      return true;
    } catch (err: any) {
      alert(err.message || "Failed to submit application.");
      return false;
    }
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

  const handleConnectOneAmWallet = async () => {
    console.log("[App] Connecting 1AM Wallet on Preprod...");
    const updated = await walletAdapter.connect(undefined, "1am");
    setWalletState(updated);
  };

  const handleConnectLaceWallet = async () => {
    console.log("[App] Connecting Lace Wallet on Preprod...");
    const updated = await walletAdapter.connect(undefined, "lace");
    setWalletState(updated);
  };

  const handleConnectCustomAddress = (address: string) => {
    const updated = walletAdapter.connect(address);
    setWalletState(updated as any);
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
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        userName={userName}
        walletState={walletState}
        onConnectWallet={() => setIsWalletModalOpen(true)}
        onDisconnectWallet={handleDisconnectWallet}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* If Wallet is not connected, show Connect Lace Wallet prompt */}
        {!walletState.isConnected || !walletState.address ? (
          <div className="max-w-xl mx-auto my-12 p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Wallet className="w-8 h-8 text-indigo-400" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">Connect Your Wallet</h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                Connect your Midnight Lace Wallet extension or enter your wallet address to submit applications and execute Zero-Knowledge eligibility proofs.
              </p>
            </div>
            <button
              onClick={() => setIsWalletModalOpen(true)}
              className="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all inline-flex items-center space-x-2 border border-indigo-500/30 active:scale-95 cursor-pointer"
            >
              <Wallet className="w-5 h-5" />
              <span>Connect Wallet</span>
            </button>
          </div>
        ) : !currentRole ? (
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
                currentWalletAddress={walletState.address || ""}
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

      {/* Wallet Connection Modal */}
      <WalletConnectModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnectOneAm={handleConnectOneAmWallet}
        onConnectLace={handleConnectLaceWallet}
        onConnectCustomAddress={handleConnectCustomAddress}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        address={walletState.address}
        currentRole={currentRole}
        userName={userName}
        onSaveUserName={handleSaveUserName}
        onDisconnect={handleDisconnectWallet}
      />

      {/* Privacy & Technology Explanation Modal */}
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Clean Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-400">
        Private Scholarship Eligibility Verification &copy; 2026 Powered by Midnight Network ZK Smart Contracts.
      </footer>

    </div>
  );
}

export default App;
