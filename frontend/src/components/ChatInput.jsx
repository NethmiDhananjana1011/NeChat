import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowUp, 
  Square, 
  Image as ImageIcon, 
  Mic, 
  MicOff, 
  X 
} from 'lucide-react';

export const ChatInput = ({ 
  onSendMessage, 
  isGenerating = false, 
  onStopGeneration,
  onVoiceSimulate,
  disabled = false
}) => {
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-resize textarea dynamically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 160)}px`;
    }
  }, [text]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (isGenerating) return;
    const cleanText = text.trim();
    if (!cleanText && !selectedImage) return;

    onSendMessage({
      text: cleanText,
      image: selectedImage
    });

    setText('');
    setSelectedImage(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be under 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target.result);
    };
    reader.readAsDataURL(file);

    e.target.value = '';
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const handleMicToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    if (onVoiceSimulate) {
      onVoiceSimulate("Nechat is listening... Speak now");
    }

    setTimeout(() => {
      setIsRecording(false);
      const voicePrompts = [
        "Explain how the Transformer architecture revolutionized natural language processing.",
        "How do I optimize React components for 60fps animations?",
        "Compare SQL vs NoSQL databases with pros and cons."
      ];
      const chosen = voicePrompts[Math.floor(Math.random() * voicePrompts.length)];
      setText((prev) => (prev ? `${prev} ${chosen}` : chosen));
      if (onVoiceSimulate) {
        onVoiceSimulate("Voice converted to text!");
      }
    }, 2200);
  };

  const canSend = (text.trim().length > 0 || selectedImage !== null) && !isGenerating;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4">
      {/* Pill Container Card */}
      <div className="relative rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-2xl backdrop-blur-xl transition-all focus-within:border-zinc-700/80 focus-within:ring-1 focus-within:ring-zinc-700/50">
        
        {/* Image Attachment Preview */}
        {selectedImage && (
          <div className="p-3 pb-0 flex items-center gap-2">
            <div className="relative inline-block group">
              <img 
                src={selectedImage} 
                alt="Upload preview" 
                className="w-16 h-16 object-cover rounded-xl border border-zinc-700/80 shadow-md"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-full flex items-center justify-center border border-zinc-600 transition-colors shadow-sm"
                title="Remove image"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <span className="text-xs text-zinc-400">Image attached for Nechat analysis</span>
          </div>
        )}

        {/* Text Area & Integrated Controls */}
        <div className="flex items-end gap-2 p-3">
          {/* Hidden Image Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageSelect} 
            accept="image/*" 
            className="hidden" 
          />

          {/* Left Action Buttons: Image Upload */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isGenerating}
            title="Attach image"
            className="p-2 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850 transition-colors flex-shrink-0 disabled:opacity-40"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* Auto-expanding Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isRecording ? "Listening to your voice..." : "Ask Nechat anything..."}
            disabled={disabled}
            className="flex-1 max-h-40 bg-transparent resize-none border-0 focus:outline-none focus:ring-0 text-zinc-100 placeholder-zinc-500 text-[15px] leading-6 py-1 px-1"
          />

          {/* Microphone Simulation Button */}
          <button
            type="button"
            onClick={handleMicToggle}
            disabled={disabled || isGenerating}
            title={isRecording ? "Stop listening" : "Voice input"}
            className={`p-2 rounded-full transition-all flex-shrink-0 ${
              isRecording 
                ? 'bg-rose-500/20 text-rose-400 ring-2 ring-rose-500/50 animate-pulse' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850 disabled:opacity-40'
            }`}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Send or Stop Generation Button */}
          {isGenerating ? (
            <button
              type="button"
              onClick={onStopGeneration}
              title="Stop generation"
              className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white flex-shrink-0 transition-colors"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSend}
              title="Send to Nechat"
              className={`p-2 rounded-full flex-shrink-0 transition-all duration-200 ${
                canSend 
                  ? 'bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25 hover:opacity-95 active:scale-95' 
                  : 'bg-zinc-800/60 text-zinc-600 cursor-not-allowed'
              }`}
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Footer Disclaimer */}
      <p className="text-center text-xs text-zinc-500 mt-2 select-none">
        Nechat can make mistakes, so double-check its responses.
      </p>
    </div>
  );
};

export default ChatInput;
