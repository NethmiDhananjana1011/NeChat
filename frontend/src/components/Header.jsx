import React from 'react';
import { 
  PanelLeft, 
  Sparkles, 
  Plus, 
  Settings 
} from 'lucide-react';

export const Header = ({ 
  isSidebarOpen, 
  onToggleSidebar, 
  onNewChat, 
  onOpenSettings,
  isLiveApi = false,
  activeModel = 'openrouter/free'
}) => {
  // Format model name for clean display
  const modelShortName = activeModel.includes('/') 
    ? activeModel.split('/')[1].replace(':free', '') 
    : activeModel;

  return (
    <header className="h-14 border-b border-zinc-800/80 bg-black/60 backdrop-blur-md px-4 flex items-center justify-between flex-shrink-0 z-30 select-none">
      {/* Left: Sidebar toggle and Brand */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
          className="p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 transition-colors"
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="font-bold text-base md:text-lg tracking-tight text-white flex items-center gap-1.5">
            <span className="nechat-gradient-text">Nechat</span>
            <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
          </span>

          {/* Model Status Badge */}
          <div 
            onClick={onOpenSettings}
            title="Click to change model or settings"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 cursor-pointer transition-colors"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isLiveApi ? 'bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50' : 'bg-sky-400'}`} />
            <span className="capitalize">{modelShortName}</span>
            <span className={`text-[10px] px-1 rounded font-mono ${isLiveApi ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60' : 'bg-zinc-800 text-zinc-400'}`}>
              {isLiveApi ? 'ONLINE' : 'MOCK'}
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onNewChat}
          title="New Chat"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-zinc-300 hover:text-white border border-zinc-800 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Chat</span>
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          title="Settings & Config"
          className="p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default Header;
