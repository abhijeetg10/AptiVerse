import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface UserWarningModalProps {
  warningMessage: string;
  onAcknowledge: () => void;
}

export const UserWarningModal: React.FC<UserWarningModalProps> = ({ warningMessage, onAcknowledge }) => {
  return (
    <div className="fixed inset-0 z-[10000] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 border-2 border-amber-400 text-center relative overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Warning Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-red-500 to-amber-500" />

        {/* Warning Icon */}
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <ShieldAlert size={36} className="text-amber-600" />
        </div>

        {/* Title */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wider mb-3">
          <AlertTriangle size={14} />
          Fair Play Violation Notice
        </span>

        <h3 className="text-2xl font-black text-slate-900 mb-2">
          Account Notice
        </h3>

        {/* Warning Message Box */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-left my-4 text-slate-700 text-sm leading-relaxed whitespace-pre-line font-medium">
          {warningMessage}
        </div>

        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          Manipulating game data, executing automated scripts, or attempting unauthorized database modifications violates Aptiverse terms. Continued infractions will result in permanent account suspension and score removal.
        </p>

        {/* Acknowledge Button */}
        <button
          onClick={onAcknowledge}
          className="w-full py-3.5 px-6 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
        >
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span>I Understand & Agree to Fair Play</span>
        </button>
      </div>
    </div>
  );
};

export default UserWarningModal;
