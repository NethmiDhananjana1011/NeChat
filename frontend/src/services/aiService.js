/**
 * Smart AI Response Engine
 * Supports realistic, keyword-aware mock responses with rich markdown & code snippets,
 * and optional live Google Gemini API integration when an API key is provided.
 */

// Keyword-based realistic responses
const MOCK_KNOWLEDGE_BASE = [
  {
    keywords: ["react", "component", "button", "hook", "state", "ui"],
    response: `Here is a modern, production-ready **React Component** built with Tailwind CSS and Lucide icons:

\`\`\`jsx
import React, { useState } from 'react';
import { Sparkles, Check, Loader2 } from 'lucide-react';

export const InteractiveButton = ({ 
  children = "Generate with AI", 
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
      className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm text-white bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:opacity-95 active:scale-95 transition-all duration-200 shadow-lg shadow-indigo-500/25 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-white" />
      ) : success ? (
        <Check className="w-4 h-4 text-emerald-300" />
      ) : (
        <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
      )}
      <span>{loading ? "Processing..." : success ? "Completed!" : children}</span>
    </button>
  );
};

export default InteractiveButton;
\`\`\`

### Key Features of this component:
1. **Interactive States**: Supports normal, loading, and temporary success feedback.
2. **Glass & Gradient Aesthetics**: Matches Gemini's dark futuristic design language.
3. **Smooth Micro-interactions**: Includes \`active:scale-95\` and subtle shadow glows.
4. **Accessible**: Properly manages \`disabled\` attributes and keyboard navigation.

Would you like me to customize this component or add TypeScript types?`
  },
  {
    keywords: ["debug", "error", "bug", "fix", "troubleshoot", "issue"],
    response: `Let's debug this issue methodically! Here is a checklist and structured solution:

### 1. Common Root Causes
- **Stale State / Closures**: Ensure hooks like \`useEffect\` or event handlers are referencing updated values.
- **Asynchronous Race Conditions**: Promises resolving out of sequence can overwrite newer UI states.
- **Undefined Property Access**: Forgetting optional chaining (\`?.\`) when dealing with loaded data.

### 2. Recommended Fix & Guard Pattern

\`\`\`javascript
// Safe state update pattern with error handling
async function handleDataFetch(resourceId) {
  try {
    const response = await fetch(\`/api/items/\${resourceId}\`);
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    const data = await response.json();
    
    // Guard against nullish data
    return data?.results ?? [];
  } catch (error) {
    console.error('[Debug Error]: Failed to fetch resource:', error);
    // Graceful fallback for UI resilience
    return [];
  }
}
\`\`\`

### 3. Debugging Tips:
- Open your browser's DevTools (\`F12\`) and check the **Console** and **Network** tabs.
- Place a \`debugger;\` statement or \`console.table(data)\` right before the faulty line.
- If you share the exact error stack trace or code snippet, I can provide the pinpoint patch!`
  },
  {
    keywords: ["explain", "concept", "quantum", "llm", "neural", "how does", "what is"],
    response: `Here is a clear, intuitive breakdown of how **Modern Large Language Models (LLMs)** like Gemini work:

### The Intuitive Analogy: The Global Library & Predictive Scribe
Imagine a librarian who has read billions of books, articles, and conversations across human history. When you give them a sentence, they don't look up a static database of pre-written answers; instead, they compute the most probable next word based on context.

---

### Key Architecture Pillars:

1. **Tokenization**
   - Text is split into small pieces called *tokens* (words or sub-words).
   - For example: \`"Understanding AI"\` $\\rightarrow$ \`["Under", "standing", " AI"]\`.

2. **Self-Attention Mechanism (Transformers)**
   - Allows the model to look at every word in your prompt simultaneously and decide which words matter most in relation to each other.
   - In *"The bank was closed because of the river flooding"*, attention links *"bank"* to *"river"*, not financial institutions.

3. **Reinforcement Learning from Human Feedback (RLHF)**
   - Human evaluators score responses for helpfulness, accuracy, and safety, shaping the raw model into an interactive assistant.

| Stage | Input | Purpose |
| :--- | :--- | :--- |
| **Pre-training** | Trillions of web tokens | Learns grammar, facts, and reasoning patterns |
| **Instruction Tuning** | Question & Answer pairs | Teaches conversational dialogue format |
| **Alignment (RLHF)** | Preference comparisons | Aligns with human values and safety standards |

Would you like to dive deeper into any specific math formula, attention weights, or embedding dimensions?`
  },
  {
    keywords: ["project", "ideas", "brainstorm", "saas", "app", "startup"],
    response: `Here are **4 high-potential AI project ideas** you can build today, complete with architecture suggestions:

### 1. 🎙️ AI Voice Note Synthesizer & Action-Item Extractor
- **Concept**: Record audio notes or upload meeting clips; the app transcribes, summarizes, and automatically generates task cards for your Kanban board.
- **Tech Stack**: Next.js / Vite React, Web Audio API, Gemini Audio Multimodal API.
- **Why it stands out**: Solves genuine daily productivity friction.

### 2. ⚡ Real-Time Code Explainer & Visualizer
- **Concept**: Paste any complex algorithm or SQL query; the app provides a visual interactive flowchart alongside line-by-line annotations.
- **Tech Stack**: React Flow, Tailwind CSS, Monaco Editor / PrismJS, Gemini Flash.
- **Monetization**: Tiered team subscriptions for onboarding engineers.

### 3. 📄 Multimodal Document Deep-Searcher
- **Concept**: Drag-and-drop research papers, invoices, or charts; ask natural questions with visual citations highlighting exact pages.
- **Tech Stack**: Vector Database (Pinecone / Chroma), LangChain / LlamaIndex, React frontend.

### 4. 🎨 Gemini Canvas (Interactive Artifact Studio)
- **Concept**: Chat with AI while live rendering generated components (HTML/Tailwind, SVG charts, formulas) side-by-side in real-time sandbox.

Which of these sparks your interest? I can generate the project folder structure or kickoff boilerplate for you right away!`
  },
  {
    keywords: ["python", "script", "automation", "scrape", "data"],
    response: `Here is a high-performance **Python automation script** using modern asynchronous concurrency:

\`\`\`python
import asyncio
import aiohttp
from typing import List, Dict, Any

async def fetch_endpoint(session: aiohttp.ClientSession, url: str) -> Dict[str, Any]:
    """Fetch JSON from a URL asynchronously with timeout."""
    try:
        async with session.get(url, timeout=10) as response:
            if response.status == 200:
                return await response.json()
            return {"error": f"Status code {response.status}", "url": url}
    except Exception as e:
        return {"error": str(e), "url": url}

async def run_batch_scrape(urls: List[str]) -> List[Dict[str, Any]]:
    headers = {"User-Agent": "GeminiAutomationEngine/2.0"}
    async with aiohttp.ClientSession(headers=headers) as session:
        tasks = [fetch_endpoint(session, url) for url in urls]
        results = await asyncio.gather(*tasks)
        return results

if __name__ == "__main__":
    sample_urls = [
        "https://api.github.com/repos/facebook/react",
        "https://api.github.com/repos/vitejs/vite",
    ]
    print("Initiating async batch runner...")
    output = asyncio.run(run_batch_scrape(sample_urls))
    for item in output:
        name = item.get("full_name", "Unknown")
        stars = item.get("stargazers_count", 0)
        print(f"⭐ {name}: {stars:,} stars")
\`\`\`

### Why this approach is optimal:
- **Non-blocking I/O**: Performs network requests in parallel rather than sequentially.
- **Type Hinting**: Clean, maintainable \`typing\` constructs for enterprise-readiness.
- **Proper Session Management**: Uses a single \`aiohttp.ClientSession\` across connections.`
  }
];

// Fallback intelligent response generator for any query
function generateIntelligentFallback(prompt, hasImage = false) {
  const cleanPrompt = prompt.trim();
  
  if (hasImage) {
    return `### 🖼️ Multimodal Analysis Result

I've examined the image you attached alongside your inquiry:
*"${cleanPrompt || 'Analyze image'}"*

1. **Visual Content Breakdown**:
   - The image has been processed through the visual feature extractor.
   - Identified key visual hierarchies, composition, and high-contrast boundaries.
2. **Contextual Evaluation**:
   - Matches standard visual design patterns and digital layout guidelines.
   - Color palette and spatial grouping appear well-balanced.
3. **Actionable Suggestions**:
   - If this is a UI mockup, ensuring at least **4.5:1 contrast ratio** for text readability is recommended.
   - For responsive design, verify how this layout collapses onto viewport widths under **640px**.

Let me know if you would like me to convert this visual into React + Tailwind code or perform deeper optical OCR extraction!`;
  }

  return `### Insights & Answer

Regarding your prompt: **"${cleanPrompt}"**

Here is a structured overview and practical takeaway:

1. **Core Concept**:
   - When approaching this problem, breaking it down into distinct modular layers yields the cleanest results.
   - Prioritize simplicity, readability, and performance.

2. **Recommended Best Practice**:
   - Maintain a single source of truth for your state and data pipelines.
   - Leverage fast, declarative tools and automated verification early.

3. **Next Steps**:
   - Would you like a step-by-step implementation guide?
   - Or would you prefer a concrete code example tailored to your exact stack?

Feel free to ask follow-up questions or request adjustments!`;
}

/**
 * Fetch response from Google Gemini API (if user configured a key)
 */
async function callGeminiApi(prompt, apiKey, imageBase64 = null) {
  // Use Gemini 1.5 Flash endpoint
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const parts = [];
  if (imageBase64) {
    // Strip header prefix if present (e.g. data:image/png;base64,)
    const match = imageBase64.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
    if (match) {
      parts.push({
        inline_data: {
          mime_type: match[1],
          data: match[2]
        }
      });
    }
  }
  parts.push({ text: prompt });

  const payload = {
    contents: [
      {
        parts: parts
      }
    ]
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Gemini API request failed with status ${response.status}`);
  }

  const data = await response.json();
  const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!candidateText) {
    throw new Error("No response generated by Gemini API.");
  }
  return candidateText;
}

/**
 * Main Service API
 * Resolves full response string (either from Live Gemini API or smart keyword mock)
 */
export async function getAiResponse(prompt, options = {}) {
  const { apiKey, image, forceMock = false } = options;

  // 1. If API key is provided and mock is not forced, try live API
  if (apiKey && apiKey.trim() && !forceMock) {
    try {
      return await callGeminiApi(prompt, apiKey.trim(), image);
    } catch (err) {
      console.warn("Live Gemini API call failed, falling back to smart mock engine:", err.message);
      // Fallback with informative notice
      const fallback = getMockResponse(prompt, !!image);
      return `> ⚠️ *Live Gemini API call encountered an error (${err.message}). Switched to offline smart engine:*\n\n${fallback}`;
    }
  }

  // 2. Intelligent Mock Engine
  return getMockResponse(prompt, !!image);
}

/**
 * Get intelligent mock response based on prompt text
 */
export function getMockResponse(prompt, hasImage = false) {
  const lower = prompt.toLowerCase();
  
  // Find best matching knowledge base entry
  let bestMatch = null;
  let maxScore = 0;

  for (const entry of MOCK_KNOWLEDGE_BASE) {
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

  return generateIntelligentFallback(prompt, hasImage);
}

