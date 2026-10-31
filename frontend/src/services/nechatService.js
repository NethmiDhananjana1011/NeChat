/**
 * Nechat Intelligence Engine with OpenRouter API Integration
 * Persona: "Nechat" - an intelligent, fluid, next-generation AI assistant.
 * Powered by OpenRouter using user's API Key with real-time SSE streaming.
 */

export const NECHAT_DEFAULT_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_OPENROUTER_API_KEY)
  ? import.meta.env.VITE_OPENROUTER_API_KEY
  : '';

export const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

export const AVAILABLE_MODELS = [
  { id: 'openrouter/free', name: 'OpenRouter Free Router (Recommended)', desc: 'Auto-routes to the best free model available' },
  { id: 'nvidia/nemotron-3-ultra-550b-a55b:free', name: 'NVIDIA Nemotron 3 Ultra (Free)', desc: 'Massive parameter reasoning model' },
  { id: 'google/gemma-4-31b-it:free', name: 'Google Gemma 4 31B (Free)', desc: 'Google next-gen instruction tuned' },
  { id: 'liquid/lfm-2.5-2.6b:free', name: 'Liquid LFM 2.5 (Free)', desc: 'Ultra-fast low-latency neural model' },
  { id: 'openrouter/auto', name: 'OpenRouter Auto', desc: 'Auto model selector' },
];

// Offline fallback knowledge base
const NECHAT_KNOWLEDGE_BASE = [
  {
    keywords: ["who are you", "what is your name", "introduce", "identity", "nechat"],
    response: `Hello! I am **Nechat**, an intelligent, fluid AI assistant designed to help you brainstorm ideas, analyze complex data, draft clean code, and solve everyday problems with ease.

### How I can assist you:
- 💻 **Software Engineering**: Writing modern React components, TypeScript architectures, Python pipelines, and debugging complex errors.
- 🔬 **Conceptual Breakdown**: Simplifying quantum mechanics, deep learning architectures, or financial models.
- 💡 **Creative & Strategic Ideation**: Designing SaaS concepts, workflows, and user experiences.
- 🖼️ **Multimodal Processing**: Inspecting uploaded mockups, UI screenshots, and visual designs.

Feel free to ask me anything — from quick questions to deep multi-step coding tasks!`
  },
  {
    keywords: ["react", "component", "button", "hook", "state", "ui"],
    response: `Here is a modern, production-ready **React Component** built with Tailwind CSS and Lucide icons by **Nechat**:

\`\`\`jsx
import React, { useState } from 'react';
import { Sparkles, Check, Loader2 } from 'lucide-react';

export const NechatActionPill = ({ 
  children = "Execute with Nechat", 
  onClick, 
  variant = "gradient" 
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (onClick) await onClick();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm text-white bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-600 hover:opacity-95 active:scale-95 transition-all duration-200 shadow-lg shadow-indigo-500/25 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-white" />
      ) : success ? (
        <Check className="w-4 h-4 text-emerald-300" />
      ) : (
        <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
      )}
      <span>{loading ? "Nechat is processing..." : success ? "Action Done!" : children}</span>
    </button>
  );
};

export default NechatActionPill;
\`\`\`

### Key Features:
1. **Interactive State Transitions**: Smoothly shifts between normal, pending loader, and temporary success states.
2. **Nechat Aesthetics**: Utilizes cyan/indigo/purple glow gradients with deep black contrast.
3. **Micro-interactions**: Incorporates \`active:scale-95\` and hardware-accelerated transitions.`
  },
  {
    keywords: ["debug", "error", "bug", "fix", "troubleshoot", "issue"],
    response: `I'd be glad to help you troubleshoot and debug this issue! Here is **Nechat's diagnostic checklist**:

### 1. Identifying the Root Cause
- **Stale State / Closures**: Ensure your \`useEffect\` dependencies and async callback handlers capture current state rather than stale closures.
- **Asynchronous Race Conditions**: Promises resolving out-of-order can overwrite newer UI states.
- **Null / Undefined Property Access**: Guard data consumption with optional chaining (\`?.\`) or nullish coalescing (\`??\`).

### 2. Recommended Clean Guard Pattern

\`\`\`javascript
// Safe state update & fetch pattern recommended by Nechat
async function handleDataFetch(resourceId, signal) {
  try {
    const response = await fetch(\`/api/items/\${resourceId}\`, { signal });
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    const data = await response.json();
    return data?.results ?? [];
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Fetch successfully aborted');
      return [];
    }
    console.error('[Nechat Debugger]: Failed to fetch resource:', error);
    return [];
  }
}
\`\`\``
  }
];

// Fallback intelligent response generator for any query
function generateNechatFallback(prompt, hasImage = false) {
  const cleanPrompt = prompt.trim();
  
  if (hasImage) {
    return `### 🖼️ Nechat Multimodal Analysis

I've examined the image you shared alongside your inquiry:
*"${cleanPrompt || 'Analyze image'}"*

1. **Visual Breakdown**:
   - Processed visual features, layout composition, and high-contrast boundaries.
   - Identified color distribution and structured element groupings.
2. **Observations**:
   - Layout aligns with modern digital interface design standards.
   - Text elements and primary visual focal points demonstrate solid hierarchy.
3. **Suggestions**:
   - Ensure an accessible **contrast ratio of at least 4.5:1** for secondary text.
   - Check how this layout responds on mobile screen dimensions (<640px).

Let me know if you would like me to convert this visual into React + Tailwind code!`;
  }

  return `### Nechat Insights & Solutions

Regarding your query: **"${cleanPrompt}"**

Here is a structured overview and practical takeaway:

1. **Core Concept**:
   - Decomposing the problem into modular steps yields the cleanest, most maintainable results.
   - Prioritize simplicity, performance, and clear data flow.

2. **Best Practices**:
   - Maintain a single source of truth for your state.
   - Employ automated validation and defensive patterns early.

3. **Next Steps**:
   - Would you like a step-by-step implementation guide?
   - Or would you prefer a focused code snippet tailored to your exact environment?`;
}

/**
 * Get intelligent mock response based on prompt text
 */
export function getMockResponse(prompt, hasImage = false) {
  const lower = prompt.toLowerCase();
  
  let bestMatch = null;
  let maxScore = 0;

  for (const entry of NECHAT_KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (lower.includes(kw)) {
        score += 1;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch && maxScore > 0) {
    return bestMatch.response;
  }

  return generateNechatFallback(prompt, hasImage);
}

/**
 * Build messages array for OpenRouter API with conversational context
 */
function buildOpenRouterMessages(prompt, imageBase64 = null, chatHistory = []) {
  const messages = [
    {
      role: 'system',
      content: 'You are Nechat, an intelligent, sleek, and highly capable AI assistant inspired by modern conversational AI. Answer clearly, use structured Markdown with headers and clean code blocks where appropriate, and maintain a friendly, insightful persona.'
    }
  ];

  // Include up to the last 6 messages from chat history for context
  const recentHistory = chatHistory.slice(-6);
  for (const msg of recentHistory) {
    if (msg.role === 'user' || msg.role === 'assistant') {
      if (msg.content && msg.content.trim()) {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      }
    }
  }

  // Current message
  if (imageBase64) {
    messages.push({
      role: 'user',
      content: [
        { type: 'text', text: prompt || 'Please analyze this attached image.' },
        { type: 'image_url', image_url: { url: imageBase64 } }
      ]
    });
  } else {
    messages.push({
      role: 'user',
      content: prompt
    });
  }

  return messages;
}

/**
 * Call OpenRouter API with Server-Sent Events (SSE) streaming support
 */
export async function streamOpenRouterResponse(prompt, options = {}) {
  const {
    apiKey = NECHAT_DEFAULT_KEY,
    model = 'openrouter/free',
    image = null,
    chatHistory = [],
    onChunk,
    signal
  } = options;

  const keyToUse = (apiKey && apiKey.trim()) || NECHAT_DEFAULT_KEY;
  const messages = buildOpenRouterMessages(prompt, image, chatHistory);

  const response = await fetch(OPENROUTER_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${keyToUse}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin || 'http://localhost:5173',
      'X-Title': 'Nechat AI Chatbot'
    },
    body: JSON.stringify({
      model: model || 'openrouter/free',
      messages: messages,
      stream: true
    }),
    signal
  });

  if (!response.ok) {
    const errText = await response.text();
    let parsedErr = {};
    try { parsedErr = JSON.parse(errText); } catch (_) {}
    const errMsg = parsedErr.error?.message || `OpenRouter returned status ${response.status}`;
    throw new Error(errMsg);
  }

  // Parse SSE stream
  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let accumulatedText = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || ''; // Keep partial line for next iteration

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith(':')) continue;

      if (trimmed === 'data: [DONE]') {
        return accumulatedText;
      }

      if (trimmed.startsWith('data: ')) {
        const jsonStr = trimmed.slice(6);
        try {
          const parsed = JSON.parse(jsonStr);
          const delta = parsed.choices?.[0]?.delta?.content || '';
          if (delta) {
            accumulatedText += delta;
            if (onChunk) {
              onChunk(accumulatedText, delta);
            }
          }
        } catch (e) {
          // In case chunk is split across data frames
        }
      }
    }
  }

  return accumulatedText;
}

/**
 * Non-streaming OpenRouter API Call
 */
export async function callOpenRouterApi(prompt, options = {}) {
  const {
    apiKey = NECHAT_DEFAULT_KEY,
    model = 'openrouter/free',
    image = null,
    chatHistory = [],
    signal
  } = options;

  const keyToUse = (apiKey && apiKey.trim()) || NECHAT_DEFAULT_KEY;
  const messages = buildOpenRouterMessages(prompt, image, chatHistory);

  const response = await fetch(OPENROUTER_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${keyToUse}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin || 'http://localhost:5173',
      'X-Title': 'Nechat AI Chatbot'
    },
    body: JSON.stringify({
      model: model || 'openrouter/free',
      messages: messages,
      stream: false
    }),
    signal
  });

  if (!response.ok) {
    const errText = await response.text();
    let parsedErr = {};
    try { parsedErr = JSON.parse(errText); } catch (_) {}
    throw new Error(parsedErr.error?.message || `Request failed with status ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("No response text returned by model.");
  }
  return content;
}

/**
 * Main Nechat Dispatcher
 */
export async function getNechatResponse(prompt, options = {}) {
  const { apiKey, forceMock = false, image } = options;

  if (!forceMock) {
    try {
      return await callOpenRouterApi(prompt, options);
    } catch (err) {
      console.warn("OpenRouter API call failed, falling back to Nechat smart mock:", err.message);
      const fallback = getMockResponse(prompt, !!image);
      return `> ⚠️ *Live API notice: ${err.message}. Showing Nechat offline solution:*\n\n${fallback}`;
    }
  }

  return getMockResponse(prompt, !!image);
}

export default getNechatResponse;
