import React from "react";
import { ShieldCheck, Wallet, GraduationCap, Building2, ArrowRightLeft, Lock, Database } from "lucide-react";
import { UserRole } from "./RoleSelector";

interface HeaderProps {
  currentRole: UserRole;
  activeTab: "student" | "provider" | "inspector";
  setActiveTab: (tab: "student" | "provider" | "inspector") => void;
  onOpenPrivacyModal: () => void;
  walletState: {
    isConnected: boolean;
    address: string | null;
    balance: bigint;
    networkId: string;
  };
  onSelectAccount: (address: string) => void;
}

const DEMO_ACCOUNTS = [
  { label: "Provider Alpha", address: "0xaddr_provider_alpha", roleHint: "Provider" },
  { label: "Provider Beta", address: "0xaddr_provider_beta", roleHint: "Provider" },
  { label: "Student Alex", address: "0xaddr_student_alex", roleHint: "Student" },
];

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  activeTab,
  setActiveTab,
  onOpenPrivacyModal,
  walletState,
  onSelectAccount
}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[9px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-extrabold tracking-tight text-white">
                  Scholarship Portal
                </span>
                <span className="px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                  Private Verification
                </span>
              </div>
            </div>
          </div>

          {/* Clean Main Navigation */}
          {currentRole && (
            <nav className="hidden md:flex items-center space-x-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/60">
              {currentRole === "student" ? (
                <button
                  onClick={() => setActiveTab("student")}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${
                    activeTab === "student"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Student Portal</span>
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab("provider")}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${
                    activeTab === "provider"
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Provider Dashboard</span>
                </button>
              )}

              <button
                onClick={onOpenPrivacyModal}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition-all flex items-center space-x-1"
              >
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span>How Privacy Works</span>
              </button>
            </nav>
          )}

          {/* Account Selector & Locked Role Badge */}
          <div className="flex items-center space-x-3">
            
            {currentRole && (
              <span className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 ${
                currentRole === "student"
                  ? "bg-indigo-950/80 text-indigo-300 border-indigo-800"
                  : "bg-purple-950/80 text-purple-300 border-purple-800"
              }`}>
                {currentRole === "student" ? <GraduationCap className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
                <span className="capitalize">{currentRole} Account</span>
              </span>
            )}

            {/* Account Switcher Dropdown */}
            <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
              <select
                value={walletState.address || "0xaddr_provider_alpha"}
                onChange={(e) => onSelectAccount(e.target.value)}
                className="bg-transparent text-slate-200 text-xs font-mono font-medium focus:outline-none cursor-pointer py-0.5"
              >
                {DEMO_ACCOUNTS.map((acc) => (
                  <option key={acc.address} value={acc.address} className="bg-slate-900 text-white font-mono">
                    {acc.label} ({acc.address.slice(0, 8)}...)
                  </option>
                ))}
              </select>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};

