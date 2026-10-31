import React from 'react';
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Settings, 
  Sparkles, 
  X, 
  PanelLeftClose 
} from 'lucide-react';

export const Sidebar = ({
  isOpen,
  onToggle,
  chats = [],
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onOpenSettings,
  onClearAllHistory,
  userProfile = { name: 'User', email: 'user@nechat.ai' }
}) => {
  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onToggle}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col h-full bg-[#0d0d0e] border-r border-zinc-800/80 transition-all duration-300 ease-in-out select-none ${
          isOpen ? 'w-72 translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden md:border-r-0'
        }`}
      >
        {/* Top Header & New Chat Button */}
        <div className="p-4 flex flex-col gap-3">
          {/* Top Bar with brand and collapse button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-base tracking-wide text-zinc-100">
                Nechat
              </span>
            </div>

            <button
              type="button"
              onClick={onToggle}
              title="Close sidebar"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850 transition-colors"
            >
              <PanelLeftClose className="w-4 h-4 hidden md:block" />
              <X className="w-4 h-4 md:hidden" />
            </button>
          </div>

          {/* "+ New Chat" Button */}
          <button
            type="button"
            onClick={onNewChat}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-zinc-700 transition-all text-sm font-medium shadow-sm active:scale-[0.98] group"
          >
            <div className="w-5 h-5 rounded-full bg-zinc-800 group-hover:bg-zinc-700 flex items-center justify-center text-zinc-300">
              <Plus className="w-3.5 h-3.5" />
            </div>
            <span>New chat</span>
          </button>
        </div>

        {/* Recent Chats Section */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-2 py-1 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
            Recent Chats
          </div>

          {chats.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-zinc-500">
              No recent conversations yet.
            </div>
          ) : (
            chats.map((chat) => {
              const isActive = chat.id === activeChatId;
              return (
                <div
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className={`group relative flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm cursor-pointer transition-colors ${
                    isActive 
                      ? 'bg-zinc-800 text-zinc-100 font-medium' 
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-6">
                    <MessageSquare className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-sky-400' : 'text-zinc-500'}`} />
                    <span className="truncate text-xs md:text-sm">
                      {chat.title || 'Untitled Chat'}
                    </span>
                  </div>

                  {/* Delete Button (visible on hover) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                    title="Delete chat"
                    className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 rounded-md text-zinc-400 hover:text-red-400 hover:bg-zinc-700/60 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Section: Settings, Clear All, User Profile */}
        <div className="p-3 border-t border-zinc-800/80 space-y-1 bg-zinc-950/60">
          {/* Clear All History Button */}
          {chats.length > 0 && (
            <button
              type="button"
              onClick={onClearAllHistory}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-zinc-900 transition-colors text-xs"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear all conversations</span>
            </button>
          )}

          {/* Settings Button */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors text-xs"
          >
            <Settings className="w-4 h-4" />
            <span>Settings & Preferences</span>
          </button>

          {/* User Profile Badge */}
          <div className="pt-2 mt-1 border-t border-zinc-900 flex items-center gap-2.5 px-2 py-1">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-xs font-semibold text-white shadow-sm">
              {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-zinc-200 truncate">
                {userProfile.name || 'Nechat User'}
              </div>
              <div className="text-[10px] text-zinc-500 truncate">
                {userProfile.email || 'Free Plan'}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
