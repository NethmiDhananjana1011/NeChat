import React from 'react';
import { 
  Sparkles, 
  Code2, 
  Bug, 
  Lightbulb, 
  BookOpen, 
  ArrowUpRight 
} from 'lucide-react';

const SUGGESTIONS = [
  {
    title: "Explain a complex concept",
    description: "Break down modern Large Language Models and self-attention in simple, intuitive terms",
    prompt: "Explain how modern Large Language Models and the self-attention mechanism work in simple terms.",
    icon: BookOpen,
    accent: "from-sky-500/20 to-blue-500/10 border-sky-500/30 text-sky-400"
  },
  {
    title: "Write a React component",
    description: "Create an interactive glassmorphic button with loading states and Tailwind CSS",
    prompt: "Write a modern, production-ready React button component using Tailwind CSS and Lucide icons.",
    icon: Code2,
    accent: "from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-400"
  },
  {
    title: "Debug my code",
    description: "Troubleshoot async state closures, promise race conditions, and nullish bugs",
    prompt: "How can I debug and prevent async race conditions and stale closure bugs in React hooks?",
    icon: Bug,
    accent: "from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-400"
  },
  {
    title: "Brainstorm project ideas",
    description: "Explore 4 high-potential AI SaaS applications complete with tech stack suggestions",
    prompt: "Brainstorm 4 high-potential AI SaaS project ideas with tech stack suggestions and monetization angles.",
    icon: Lightbulb,
    accent: "from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-400"
  }
];

export const WelcomeScreen = ({ onSelectPrompt }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto px-4 py-8 select-none">
      {/* Nechat Sparkle Avatar */}
      <div className="mb-6 relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/20 ring-1 ring-white/20">
          <Sparkles className="w-8 h-8 text-white animate-pulse" />
        </div>
      </div>

      {/* Greeting Title with signature Nechat gradient */}
      <div className="text-center mb-10 space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          <span className="nechat-gradient-text">Hello, I'm Nechat.</span>
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl font-normal">
          How can I help you today?
        </p>
      </div>

      {/* 4 Clickable Suggestion Cards Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3.5 max-w-3xl">
        {SUGGESTIONS.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={() => onSelectPrompt(item.prompt)}
              className="text-left group relative p-4 rounded-2xl bg-zinc-900/60 hover:bg-zinc-850 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-200 flex flex-col justify-between hover:shadow-lg hover:shadow-indigo-500/5 active:scale-[0.99]"
            >
              <div className="flex items-start justify-between w-full mb-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center border ${item.accent}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="w-7 h-7 rounded-full bg-zinc-800/60 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-zinc-700 transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <h3 className="font-medium text-sm text-zinc-200 group-hover:text-white transition-colors mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WelcomeScreen;
