import React, { useState } from 'react';
import { 
  X, 
  Key, 
  Eye, 
  EyeOff, 
  Trash2, 
  Zap, 
  Sparkles, 
  Check, 
  Cpu,
  ExternalLink 
} from 'lucide-react';
import { AVAILABLE_MODELS } from '../services/nechatService';

export const SettingsModal = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onClearAllChats
}) => {
  if (!isOpen) return null;

  const [apiKey, setApiKey] = useState(settings.apiKey || '');
  const [model, setModel] = useState(settings.model || 'openrouter/free');
  const [useMockOnly, setUseMockOnly] = useState(settings.useMockOnly === true);
  const [streamSpeed, setStreamSpeed] = useState(settings.streamSpeed || 'normal');
  const [userName, setUserName] = useState(settings.userName || 'You');
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    onSaveSettings({
      ...settings,
      apiKey: apiKey.trim(),
      model: model || 'openrouter/free',
      useMockOnly,
      streamSpeed,
      userName: userName.trim() || 'You'
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl p-6 text-zinc-100 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Nechat AI Configuration</h2>
              <p className="text-xs text-zinc-400">Connected to OpenRouter with Live Streaming</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="space-y-4 pt-4">
          
          {/* User Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">
              Your Display Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-sky-500 focus:outline-none text-sm text-zinc-100 placeholder-zinc-600"
            />
          </div>

          {/* Engine Mode Toggle */}
          <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-zinc-200">
                  {useMockOnly ? 'Offline Mock Mode' : 'Live OpenRouter AI Engine'}
                </span>
                <p className="text-[11px] text-zinc-400">
                  {useMockOnly 
                    ? 'Uses built-in offline responses' 
                    : 'Actively streaming live model completions'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setUseMockOnly(!useMockOnly)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  !useMockOnly ? 'bg-sky-500' : 'bg-zinc-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    !useMockOnly ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* API Key field */}
            <div className="pt-2 border-t border-zinc-850 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-sky-400" />
                  OpenRouter API Key
                </label>
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-sky-400 hover:underline flex items-center gap-1"
                >
                  Dashboard <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="w-full pl-3 pr-10 py-2 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-sky-500 focus:outline-none text-xs font-mono text-zinc-100"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-200"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1 pt-0.5">
                <Check className="w-3 h-3" /> Authenticated & saved in local storage.
              </p>
            </div>

            {/* Model Selector */}
            <div className="pt-2 border-t border-zinc-850 space-y-1.5">
              <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                Active Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-sky-500 focus:outline-none text-xs text-zinc-100"
              >
                {AVAILABLE_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-zinc-500">
                Auto-routes to the fastest responsive model for your queries.
              </p>
            </div>
          </div>

          {/* Streaming Speed Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Stream Rendering
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'fast', label: 'Fast' },
                { id: 'normal', label: 'Normal' },
                { id: 'instant', label: 'Instant' },
              ].map((speed) => (
                <button
                  key={speed.id}
                  type="button"
                  onClick={() => setStreamSpeed(speed.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                    streamSpeed === speed.id
                      ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {speed.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear History Danger Zone */}
          <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-zinc-300">Clear All Chat History</span>
              <p className="text-[11px] text-zinc-500">Deletes all saved Nechat conversations</p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Are you sure you want to clear all Nechat conversations? This cannot be undone.")) {
                  onClearAllChats();
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-900/60 bg-red-950/20 hover:bg-red-950/50 text-red-400 text-xs transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-600 hover:opacity-95 text-white shadow-md shadow-indigo-500/20 transition-all active:scale-95"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;
