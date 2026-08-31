import React, { useState } from "react";
import { Wallet, X, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectLace: () => Promise<void>;
  onConnectCustomAddress: (address: string) => void;
}

export const WalletConnectModal: React.FC<WalletConnectModalProps> = ({
  isOpen,
  onClose,
  onConnectLace,
  onConnectCustomAddress
}) => {
  const [customAddress, setCustomAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLaceLoading, setIsLaceLoading] = useState(false);

  if (!isOpen) return null;

  const handleLaceClick = async () => {
    setError(null);
    setIsLaceLoading(true);
    try {
      await onConnectLace();
      onClose();
    } catch (err: any) {
      if (err.message === "LACE_NOT_FOUND") {
        setError("Lace Wallet Extension not detected in your browser. Please enter your wallet address below.");
      } else {
        setError(err.message || "Failed to connect Lace Wallet.");
      }
    } finally {
      setIsLaceLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAddress.trim()) {
      setError("Please enter a valid wallet address.");
      return;
    }
    onConnectCustomAddress(customAddress.trim());
    onClose();
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

        {/* Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 flex items-center justify-center shadow-lg">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Wallet className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white tracking-tight">Connect Wallet</h3>
            <p className="text-xs text-slate-400">Select your preferred Midnight wallet connection method</p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-800/50 flex items-start space-x-2 text-xs text-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Option 1: Lace Wallet Extension */}
        <div className="space-y-3">
          <button
            onClick={handleLaceClick}
            disabled={isLaceLoading}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 to-purple-950/80 hover:from-indigo-900/90 hover:to-purple-900/90 border border-indigo-700/50 flex items-center justify-between text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/30 flex items-center justify-center border border-indigo-500/30">
                <ShieldCheck className="w-4 h-4 text-indigo-300" />
              </div>
              <div>
                <div className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                  Midnight Lace Wallet Extension
                </div>
                <div className="text-[11px] text-slate-400">Official browser extension permission prompt</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-slate-800" />
          <span className="absolute px-3 bg-slate-900 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
            OR ENTER YOUR ADDRESS
          </span>
        </div>

        {/* Option 2: Enter Your Own Address */}
        <form onSubmit={handleCustomSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Your Wallet Address
            </label>
            <input
              type="text"
              value={customAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              placeholder="e.g. 0x09f417... or your address"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            Connect My Address
          </button>
        </form>

      </div>
    </div>
  );
};
