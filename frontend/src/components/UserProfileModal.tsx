import React, { useState, useEffect } from "react";
import { User, Wallet, Shield, Check, Copy, X, GraduationCap, Building2 } from "lucide-react";
import { UserRole } from "./RoleSelector";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string | null;
  currentRole: UserRole;
  userName: string;
  onSaveUserName: (newName: string) => void;
  onDisconnect: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  address,
  currentRole,
  userName,
  onSaveUserName,
  onDisconnect
}) => {
  const [nameInput, setNameInput] = useState(userName || "");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setNameInput(userName || "");
  }, [userName, isOpen]);

  if (!isOpen || !address) return null;

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onSaveUserName(nameInput.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Header */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-lg">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <User className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white tracking-tight">
              {userName || "User Profile"}
            </h3>
            <div className="flex items-center space-x-2 mt-0.5">
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border flex items-center space-x-1 ${
                currentRole === "student"
                  ? "bg-indigo-950 text-indigo-300 border-indigo-800"
                  : "bg-purple-950 text-purple-300 border-purple-800"
              }`}>
                {currentRole === "student" ? <GraduationCap className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
                <span>{currentRole || "Unassigned"}</span>
              </span>
              <span className="text-xs text-slate-400">• Midnight Network</span>
            </div>
          </div>
        </div>

        {/* Wallet Address Display */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">
            Connected Wallet Address
          </label>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
            <span className="text-xs font-mono text-slate-300 truncate mr-2">{address}</span>
            <button
              onClick={handleCopyAddress}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-all shrink-0 cursor-pointer"
              title="Copy Address"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Edit Username Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Display User Name
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter your name or organisation"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              Save Profile
            </button>
            <button
              type="button"
              onClick={() => {
                onDisconnect();
                onClose();
              }}
              className="px-4 py-2.5 text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-900/40 border border-rose-900/60 rounded-xl transition-all cursor-pointer"
            >
              Disconnect
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
