import React from 'react';
import { CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

export const Toast = ({ message, type = 'info', onClose }) => {
  if (!message) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    error: <AlertCircle className="w-4 h-4 text-rose-400" />,
    info: <Sparkles className="w-4 h-4 text-cyan-400" />,
  };

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-zinc-900/95 border border-zinc-700/80 shadow-2xl backdrop-blur-md text-xs font-medium text-zinc-100 animate-bounce-short">
      {icons[type] || icons.info}
      <span>{message}</span>
    </div>
  );
};

export default Toast;

