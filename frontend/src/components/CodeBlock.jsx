import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export const CodeBlock = ({ language = 'text', value = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="relative my-4 rounded-xl border border-zinc-800 bg-zinc-950/90 overflow-hidden shadow-lg group">
      {/* Top Language & Action Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/90 border-b border-zinc-800/80 text-xs font-mono text-zinc-400">
        <span className="font-semibold uppercase tracking-wider text-zinc-300">
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          type="button"
          aria-label="Copy code to clipboard"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 text-xs font-sans">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="text-xs font-sans">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono text-zinc-200">
        <code>{value}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;

