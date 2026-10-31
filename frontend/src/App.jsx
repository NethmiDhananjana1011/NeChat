import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import WelcomeScreen from './components/WelcomeScreen';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import SettingsModal from './components/SettingsModal';
import Toast from './components/Toast';
import { 
  streamOpenRouterResponse, 
  getMockResponse, 
  NECHAT_DEFAULT_KEY 
} from './services/nechatService';
import { 
  loadChats, 
  saveChats, 
  loadActiveChatId, 
  saveActiveChatId, 
  loadSettings, 
  saveSettings, 
  createNewConversation 
} from './utils/storage';

export default function App() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [settings, setSettings] = useState(loadSettings);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState(null);

  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);
  const stopGenerationRef = useRef(false);
  const isInitialLoadRef = useRef(true);

  // Show auto-dismissing toast
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Initial load from localStorage (nechat_history)
  useEffect(() => {
    const loadedChats = loadChats();
    const storedActiveId = loadActiveChatId();

    if (loadedChats.length > 0) {
      setChats(loadedChats);
      const exists = loadedChats.some((c) => c.id === storedActiveId);
      const initialId = exists ? storedActiveId : loadedChats[0].id;
      setActiveChatId(initialId);
      saveActiveChatId(initialId);
    } else {
      const initialChat = createNewConversation();
      setChats([initialChat]);
      setActiveChatId(initialChat.id);
      saveChats([initialChat]);
      saveActiveChatId(initialChat.id);
    }

    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  // Save chats to localStorage whenever they update
  useEffect(() => {
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      return;
    }
    saveChats(chats);
  }, [chats]);

  // Save activeChatId when it changes
  useEffect(() => {
    if (activeChatId) {
      saveActiveChatId(activeChatId);
    }
  }, [activeChatId]);

  // Current active conversation
  const currentChat = chats.find((c) => c.id === activeChatId) || null;
  const messages = currentChat?.messages || [];

  // Scroll to bottom smoothly
  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages.length, isGenerating]);

  // Create a new conversation
  const handleNewChat = () => {
    if (currentChat && currentChat.messages.length === 0) {
      return;
    }

    const newChat = createNewConversation();
    const updatedChats = [newChat, ...chats];
    setChats(updatedChats);
    setActiveChatId(newChat.id);
    saveActiveChatId(newChat.id);

    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // Switch conversation
  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
    saveActiveChatId(chatId);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // Delete a conversation
  const handleDeleteChat = (chatId) => {
    const updated = chats.filter((c) => c.id !== chatId);
    if (updated.length === 0) {
      const fresh = createNewConversation();
      setChats([fresh]);
      setActiveChatId(fresh.id);
    } else {
      setChats(updated);
      if (activeChatId === chatId) {
        setActiveChatId(updated[0].id);
      }
    }
    showToast("Chat deleted", "info");
  };

  // Clear all chats
  const handleClearAllHistory = () => {
    const fresh = createNewConversation();
    setChats([fresh]);
    setActiveChatId(fresh.id);
    saveChats([fresh]);
    saveActiveChatId(fresh.id);
    showToast("Nechat history cleared", "info");
  };

  // Save settings
  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
    showToast("Nechat settings saved", "success");
  };

  // Stop Generation
  const handleStopGeneration = () => {
    stopGenerationRef.current = true;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsGenerating(false);
    showToast("Generation halted", "info");
  };

  // Simulated Mock Typewriter Streaming (used when offline mock is chosen)
  const streamMockResponseText = async (targetText, aiMessageId, currentChatId) => {
    stopGenerationRef.current = false;
    const speed = settings.streamSpeed || 'normal';

    if (speed === 'instant') {
      setChats((prevChats) =>
        prevChats.map((c) => {
          if (c.id !== currentChatId) return c;
          return {
            ...c,
            messages: c.messages.map((m) =>
              m.id === aiMessageId
                ? { ...m, content: targetText, isThinking: false, isStreaming: false }
                : m
            ),
          };
        })
      );
      setIsGenerating(false);
      return;
    }

    const delayMs = speed === 'fast' ? 10 : 20;
    const words = targetText.split(/(\s+)/);
    let streamedSoFar = '';

    for (let i = 0; i < words.length; i++) {
      if (stopGenerationRef.current) break;

      streamedSoFar += words[i];

      setChats((prevChats) =>
        prevChats.map((c) => {
          if (c.id !== currentChatId) return c;
          return {
            ...c,
            messages: c.messages.map((m) =>
              m.id === aiMessageId
                ? { ...m, content: streamedSoFar, isThinking: false, isStreaming: true }
                : m
            ),
          };
        })
      );

      if (words[i].trim().length > 0) {
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }

    setChats((prevChats) =>
      prevChats.map((c) => {
        if (c.id !== currentChatId) return c;
        return {
          ...c,
          messages: c.messages.map((m) =>
            m.id === aiMessageId
              ? { ...m, isStreaming: false, isThinking: false }
              : m
          ),
        };
      })
    );
    setIsGenerating(false);
  };

  // Submit User Message
  const handleSendMessage = async ({ text, image }) => {
    if (isGenerating) return;

    let targetChatId = activeChatId;
    let targetChat = chats.find((c) => c.id === targetChatId);

    if (!targetChat) {
      targetChat = createNewConversation();
      targetChatId = targetChat.id;
      setChats([targetChat, ...chats]);
      setActiveChatId(targetChatId);
    }

    const userMessageId = 'msg_user_' + Date.now();
    const aiMessageId = 'msg_ai_' + (Date.now() + 1);

    const userMessage = {
      id: userMessageId,
      role: 'user',
      content: text,
      image: image || null,
      timestamp: new Date().toISOString(),
    };

    const aiPlaceholder = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      isThinking: true,
      isStreaming: false,
      timestamp: new Date().toISOString(),
    };

    const isFirstMessage = targetChat.messages.length === 0;
    const newTitle = isFirstMessage 
      ? (text ? (text.length > 28 ? text.slice(0, 28) + '...' : text) : 'Visual Query')
      : targetChat.title;

    // Append to UI immediately
    setChats((prevChats) =>
      prevChats.map((c) => {
        if (c.id !== targetChatId) return c;
        return {
          ...c,
          title: newTitle,
          updatedAt: new Date().toISOString(),
          messages: [...c.messages, userMessage, aiPlaceholder],
        };
      })
    );

    setIsGenerating(true);
    stopGenerationRef.current = false;
    abortControllerRef.current = new AbortController();

    const currentHistory = targetChat.messages;

    try {
      // 1-second simulated thinking time for genuine fluid feel
      await new Promise((resolve) => setTimeout(resolve, 900));

      if (stopGenerationRef.current) {
        setIsGenerating(false);
        return;
      }

      // Check if user enabled Live Mode (OpenRouter API)
      const isLive = !settings.useMockOnly;
      const apiKeyToUse = settings.apiKey || NECHAT_DEFAULT_KEY;

      if (isLive && apiKeyToUse) {
        try {
          // Switch placeholder from thinking to streaming
          setChats((prevChats) =>
            prevChats.map((c) => {
              if (c.id !== targetChatId) return c;
              return {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === aiMessageId
                    ? { ...m, isThinking: false, isStreaming: true }
                    : m
                ),
              };
            })
          );

          // Real-time SSE streaming from OpenRouter
          await streamOpenRouterResponse(text, {
            apiKey: apiKeyToUse,
            model: settings.model || 'openrouter/free',
            image: image,
            chatHistory: currentHistory,
            signal: abortControllerRef.current.signal,
            onChunk: (accumulated) => {
              setChats((prevChats) =>
                prevChats.map((c) => {
                  if (c.id !== targetChatId) return c;
                  return {
                    ...c,
                    messages: c.messages.map((m) =>
                      m.id === aiMessageId
                        ? { ...m, content: accumulated, isThinking: false, isStreaming: true }
                        : m
                    ),
                  };
                })
              );
            }
          });

          // Finished streaming
          setChats((prevChats) =>
            prevChats.map((c) => {
              if (c.id !== targetChatId) return c;
              return {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === aiMessageId
                    ? { ...m, isStreaming: false, isThinking: false }
                    : m
                ),
              };
            })
          );
          setIsGenerating(false);
          return;
        } catch (apiError) {
          if (apiError.name === 'AbortError') {
            setIsGenerating(false);
            return;
          }
          console.warn("OpenRouter API streaming failed, falling back to smart engine:", apiError.message);
          
          // Fallback notice + smart mock solution
          const fallback = getMockResponse(text, !!image);
          const fullFallback = `> ⚠️ *Live API notice (${apiError.message}). Here is Nechat's response:*\n\n${fallback}`;
          await streamMockResponseText(fullFallback, aiMessageId, targetChatId);
          return;
        }
      }

      // Mock mode fallback
      const mockAnswer = getMockResponse(text, !!image);
      await streamMockResponseText(mockAnswer, aiMessageId, targetChatId);
    } catch (err) {
      console.error('Failed to generate response:', err);
      setChats((prevChats) =>
        prevChats.map((c) => {
          if (c.id !== targetChatId) return c;
          return {
            ...c,
            messages: c.messages.map((m) =>
              m.id === aiMessageId
                ? {
                    ...m,
                    content: `⚠️ *An error occurred: ${err.message || 'Unknown error'}*`,
                    isThinking: false,
                    isStreaming: false,
                  }
                : m
            ),
          };
        })
      );
      setIsGenerating(false);
    }
  };

  // Regenerate latest response
  const handleRegenerate = async () => {
    if (isGenerating || !currentChat) return;
    const msgs = currentChat.messages;
    if (msgs.length < 2) return;

    const lastUserMsg = [...msgs].reverse().find((m) => m.role === 'user');
    if (!lastUserMsg) return;

    // Filter out previous assistant response
    const filteredMessages = msgs.slice(0, -1);
    const aiMessageId = 'msg_ai_regen_' + Date.now();

    const aiPlaceholder = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      isThinking: true,
      isStreaming: false,
      timestamp: new Date().toISOString(),
    };

    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== activeChatId) return c;
        return {
          ...c,
          messages: [...filteredMessages, aiPlaceholder],
        };
      })
    );

    setIsGenerating(true);
    stopGenerationRef.current = false;
    abortControllerRef.current = new AbortController();

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const isLive = !settings.useMockOnly;
      const apiKeyToUse = settings.apiKey || NECHAT_DEFAULT_KEY;

      if (isLive && apiKeyToUse) {
        setChats((prevChats) =>
          prevChats.map((c) => {
            if (c.id !== activeChatId) return c;
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === aiMessageId
                  ? { ...m, isThinking: false, isStreaming: true }
                  : m
              ),
            };
          })
        );

        await streamOpenRouterResponse(lastUserMsg.content, {
          apiKey: apiKeyToUse,
          model: settings.model || 'openrouter/free',
          image: lastUserMsg.image,
          chatHistory: filteredMessages,
          signal: abortControllerRef.current.signal,
          onChunk: (accumulated) => {
            setChats((prevChats) =>
              prevChats.map((c) => {
                if (c.id !== activeChatId) return c;
                return {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === aiMessageId
                      ? { ...m, content: accumulated, isThinking: false, isStreaming: true }
                      : m
                  ),
                };
              })
            );
          }
        });

        setChats((prevChats) =>
          prevChats.map((c) => {
            if (c.id !== activeChatId) return c;
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === aiMessageId
                  ? { ...m, isStreaming: false, isThinking: false }
                  : m
              ),
            };
          })
        );
        setIsGenerating(false);
        showToast("Response regenerated", "info");
        return;
      }

      const mockAnswer = getMockResponse(lastUserMsg.content, !!lastUserMsg.image);
      await streamMockResponseText(mockAnswer, aiMessageId, activeChatId);
      showToast("Response regenerated", "info");
    } catch (err) {
      setIsGenerating(false);
      showToast("Regeneration failed", "error");
    }
  };

  // Feedback thumb rating
  const handleFeedback = (messageId, rating) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== activeChatId) return c;
        return {
          ...c,
          messages: c.messages.map((m) =>
            m.id === messageId ? { ...m, feedback: rating } : m
          ),
        };
      })
    );
    if (rating) {
      showToast(rating === 'up' ? "Marked as helpful" : "Feedback recorded", "success");
    }
  };

  const isLiveMode = !settings.useMockOnly && !!(settings.apiKey || NECHAT_DEFAULT_KEY);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black text-zinc-100 font-sans">
      {/* Collapsible Left Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onClearAllHistory={handleClearAllHistory}
        userProfile={{ name: settings.userName, email: settings.userEmail }}
      />

      {/* Main Chat Workspace */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-black relative">
        {/* Top Header */}
        <Header
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onNewChat={handleNewChat}
          onOpenSettings={() => setIsSettingsOpen(true)}
          isLiveApi={isLiveMode}
          activeModel={settings.model || 'openrouter/free'}
        />

        {/* Center Chat Feed / Welcome State */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 relative scroll-smooth flex flex-col">
          {messages.length === 0 ? (
            <WelcomeScreen
              onSelectPrompt={(prompt) => handleSendMessage({ text: prompt })}
            />
          ) : (
            <div className="w-full max-w-3xl mx-auto py-6 flex-1 flex flex-col">
              {messages.map((msg, index) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  isLatestAi={
                    msg.role === 'assistant' && 
                    index === messages.length - 1
                  }
                  onRegenerate={handleRegenerate}
                  onFeedback={handleFeedback}
                />
              ))}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>

        {/* Floating Bottom Input Bar */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isGenerating={isGenerating}
          onStopGeneration={handleStopGeneration}
          onVoiceSimulate={(notice) => showToast(notice, 'info')}
        />
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onClearAllChats={handleClearAllHistory}
      />

      {/* Notification Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
