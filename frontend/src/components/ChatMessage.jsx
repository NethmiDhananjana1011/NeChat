import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  ThumbsUp, 
  ThumbsDown,
  Volume2,
  VolumeX
} from 'lucide-react';
import CodeBlock from './CodeBlock';

export const ChatMessage = ({ 
  message, 
  isLatestAi = false,
  onRegenerate,
  onFeedback
}) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [thumbs, setThumbs] = useState(message.feedback || null);
  const [speaking, setSpeaking] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const handleThumb = (type) => {
    const nextVal = thumbs === type ? null : type;
    setThumbs(nextVal);
    if (onFeedback) {
      onFeedback(message.id, nextVal);
    }
  };

  const handleSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message.content.replace(/[`*_#]/g, ''));
    utterance.rate = 1.0;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  if (isUser) {
    return (
      <div className="flex justify-end w-full my-4">
        <div className="max-w-[85%] md:max-w-[70%] flex flex-col items-end gap-2">
          {/* User Attached Image (if any) */}
          {message.image && (
            <div className="rounded-2xl overflow-hidden border border-zinc-700/60 max-w-xs shadow-lg bg-zinc-900">
              <img 
                src={message.image} 
                alt="Attached visual" 
                className="w-full max-h-60 object-cover" 
              />
            </div>
          )}
          
          {/* User Text Bubble */}
          <div className="bg-zinc-800 text-zinc-100 rounded-3xl rounded-br-lg px-5 py-3 border border-zinc-700/50 shadow-md text-[15px] leading-relaxed break-words whitespace-pre-wrap">
            {message.content}
          </div>
        </div>
      </div>
    );
  }

  // Nechat AI Message
  return (
    <div className="flex gap-4 w-full my-6 text-zinc-100 group">
      {/* Nechat Avatar Icon */}
      <div className="flex-shrink-0 pt-0.5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 ring-1 ring-white/10">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Response Content & Controls */}
      <div className="flex-1 min-w-0">
        {/* Thinking State */}
        {message.isThinking ? (
          <div className="flex items-center gap-3 py-2 text-sm text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-75" />
            </div>
            <span className="nechat-gradient-text font-medium text-sm tracking-wide">
              Nechat is thinking...
            </span>
          </div>
        ) : (
          <>
            {/* Markdown Rendered Content */}
            <div className="prose prose-invert max-w-none text-[15px] leading-relaxed text-zinc-200">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    if (!inline && (match || String(children).includes('\n'))) {
                      return (
                        <CodeBlock
                          language={match ? match[1] : 'text'}
                          value={String(children).replace(/\n$/, '')}
                        />
                      );
                    }
                    return (
                      <code className="bg-zinc-800/90 text-cyan-200 font-mono text-xs px-1.5 py-0.5 rounded border border-zinc-700/50" {...props}>
                        {children}
                      </code>
                    );
                  },
                  p({ children }) {
                    return <p className="mb-3 last:mb-0 leading-7">{children}</p>;
                  },
                  ul({ children }) {
                    return <ul className="list-disc pl-5 my-3 space-y-1 text-zinc-200">{children}</ul>;
                  },
                  ol({ children }) {
                    return <ol className="list-decimal pl-5 my-3 space-y-1 text-zinc-200">{children}</ol>;
                  },
                  li({ children }) {
                    return <li className="leading-7">{children}</li>;
                  },
                  h1({ children }) {
                    return <h1 className="text-xl md:text-2xl font-bold text-white mt-4 mb-2 tracking-tight">{children}</h1>;
                  },
                  h2({ children }) {
                    return <h2 className="text-lg md:text-xl font-semibold text-white mt-4 mb-2 tracking-tight">{children}</h2>;
                  },
                  h3({ children }) {
                    return <h3 className="text-base md:text-lg font-semibold text-zinc-100 mt-3 mb-1.5">{children}</h3>;
                  },
                  blockquote({ children }) {
                    return (
                      <blockquote className="border-l-2 border-indigo-500/80 pl-4 py-1 my-3 bg-zinc-900/40 rounded-r-lg text-zinc-300 italic">
                        {children}
                      </blockquote>
                    );
                  },
                  table({ children }) {
                    return (
                      <div className="overflow-x-auto my-4 rounded-xl border border-zinc-800 bg-zinc-950/70">
                        <table className="min-w-full divide-y divide-zinc-800 text-left text-sm">{children}</table>
                      </div>
                    );
                  },
                  th({ children }) {
                    return <th className="px-4 py-2.5 bg-zinc-900/80 font-semibold text-zinc-200 border-b border-zinc-800">{children}</th>;
                  },
                  td({ children }) {
                    return <td className="px-4 py-2.5 border-b border-zinc-900/50 text-zinc-300">{children}</td>;
                  },
                  a({ href, children }) {
                    return (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-sky-400 underline decoration-sky-500/40 hover:decoration-sky-400 transition-colors">
                        {children}
                      </a>
                    );
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>

              {/* Streaming Cursor */}
              {message.isStreaming && (
                <span className="inline-block w-2 h-4 ml-1 bg-sky-400 animate-blink align-middle rounded-sm" />
              )}
            </div>

            {/* Action Buttons Below Response (Visible once streaming finishes) */}
            {!message.isStreaming && (
              <div className="flex items-center gap-1 mt-3 pt-2 text-zinc-400 opacity-90 transition-opacity">
                {/* Copy Button */}
                <button
                  type="button"
                  onClick={handleCopy}
                  title="Copy response"
                  className="p-1.5 rounded-lg hover:bg-zinc-800 hover:text-zinc-200 transition-colors flex items-center gap-1.5 text-xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 text-xs">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="hidden sm:inline text-xs">Copy</span>
                    </>
                  )}
                </button>

                {/* Regenerate Button */}
                {isLatestAi && onRegenerate && (
                  <button
                    type="button"
                    onClick={onRegenerate}
                    title="Regenerate response"
                    className="p-1.5 rounded-lg hover:bg-zinc-800 hover:text-zinc-200 transition-colors flex items-center gap-1 text-xs"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs">Regenerate</span>
                  </button>
                )}

                {/* Thumbs Up Button */}
                <button
                  type="button"
                  onClick={() => handleThumb('up')}
                  title="Helpful response"
                  className={`p-1.5 rounded-lg hover:bg-zinc-800 transition-colors ${
                    thumbs === 'up' ? 'text-sky-400 bg-sky-950/30' : 'hover:text-zinc-200'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>

                {/* Thumbs Down Button */}
                <button
                  type="button"
                  onClick={() => handleThumb('down')}
                  title="Unhelpful response"
                  className={`p-1.5 rounded-lg hover:bg-zinc-800 transition-colors ${
                    thumbs === 'down' ? 'text-rose-400 bg-rose-950/30' : 'hover:text-zinc-200'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>

                {/* Read Aloud Button */}
                <button
                  type="button"
                  onClick={handleSpeech}
                  title={speaking ? "Stop reading" : "Read aloud"}
                  className={`p-1.5 rounded-lg hover:bg-zinc-800 transition-colors ${
                    speaking ? 'text-cyan-400 bg-cyan-950/30' : 'hover:text-zinc-200'
                  }`}
                >
                  {speaking ? <VolumeX className="w-4 h-4 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
