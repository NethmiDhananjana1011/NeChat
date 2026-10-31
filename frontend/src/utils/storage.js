/**
 * LocalStorage Persistence and State Helpers for Nechat
 */

const STORAGE_KEYS = {
  CHATS: 'nechat_history',
  ACTIVE_CHAT_ID: 'nechat_active_chat_id',
  SETTINGS: 'nechat_settings',
};

const ENV_API_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_OPENROUTER_API_KEY) 
  ? import.meta.env.VITE_OPENROUTER_API_KEY 
  : '';

const DEFAULT_SETTINGS = {
  apiKey: ENV_API_KEY,
  model: 'openrouter/free',
  streamSpeed: 'normal', // 'fast', 'normal', 'instant'
  userName: 'You',
  userEmail: 'user@nechat.ai',
  useMockOnly: false, // Default to live OpenRouter API
};

export function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      saveSettings(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
    const parsed = JSON.parse(raw);
    
    // Ensure API key is set if missing or using old placeholder
    const merged = { ...DEFAULT_SETTINGS, ...parsed };
    if (!merged.apiKey || merged.apiKey.trim() === '') {
      merged.apiKey = ENV_API_KEY;
      merged.useMockOnly = false;
      saveSettings(merged);
    }
    return merged;
  } catch (e) {
    console.error('Failed to load settings:', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function loadChats() {
  try {
    let raw = localStorage.getItem(STORAGE_KEYS.CHATS);
    if (!raw) {
      raw = localStorage.getItem('gemini_chats_v1');
    }
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load chats from localStorage:', e);
    return [];
  }
}

export function saveChats(chats) {
  try {
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
  } catch (e) {
    console.error('Failed to save chats to localStorage:', e);
  }
}

export function loadActiveChatId() {
  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_CHAT_ID) || null;
  } catch (e) {
    return null;
  }
}

export function saveActiveChatId(id) {
  try {
    if (id) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_CHAT_ID, id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_CHAT_ID);
    }
  } catch (e) {
    console.error('Failed to save active chat id:', e);
  }
}

export function createNewConversation(initialTitle = 'New Chat') {
  return {
    id: 'nechat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    title: initialTitle,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [],
  };
}
