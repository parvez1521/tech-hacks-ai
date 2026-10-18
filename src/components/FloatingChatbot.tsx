import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  MessageSquare,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { generateGroundedResponse, ChatMessage } from '../services/chatRetrievalService.ts';
import { Link } from '../router/Router.tsx';
import { AiOrb3D } from './AiOrb3D.tsx';

export const STARTER_PROMPTS = [
  'Find free AI tools for video creation.',
  'Suggest alternatives to Claude Code.',
  'Help me choose an AI tool for coding.',
  'Find AI offers for students in India.',
  'Compare two AI tools.',
];

const INITIAL_MESSAGE: ChatMessage = {
  id: 'bot-welcome',
  sender: 'assistant',
  timestamp: Date.now(),
  text:
    '**Namaste & Welcome to Tech Hacks AI Assistant!** 🚀\n\n' +
    'I am your Tech Hacks AI Assistant. I can help you discover verified AI tools, find free video & image generators, explore open-source alternatives to SaaS, and locate exclusive student perks.\n\n' +
    'Ask in **English** or **Hindi/Hinglish** (e.g., *"Best free AI video tools"*, *"Coding ke liye best free tool"*, or *"Suggest alternatives to Claude Code"*).',
  suggestions: STARTER_PROMPTS,
};

/**
 * Curated welcome question library (Phase 25).
 * One question is randomly picked per browser session to start a relevant conversation.
 * 10 questions cover the main use-cases: video, image, coding, alternatives, student perks,
 * voice, automation, Figma replacement, free plans, and video editing.
 */
export const WELCOME_QUESTIONS = [
  'Which free AI video generator is the best right now?',
  'What is the best open-source alternative to Notion?',
  'Show me AI coding tools that have a free plan.',
  'Which AI tools are available for students in India for free?',
  'Compare Claude vs ChatGPT for writing tasks.',
  "Find me free AI image generators that don't require sign-up.",
  'What are the top AI tools for voice cloning?',
  'Help me pick an AI tool for automating my workflow.',
  'Are there any open-source alternatives to Figma?',
  'What are the best AI tools for video editing in 2025?',
] as const;

const WELCOME_Q_STORAGE_KEY = 'techhacks_welcome_q_idx';

/** Pick a random welcome question, avoiding the index shown last in this session. */
function pickWelcomeQuestion(): string {
  let lastIdx = -1;
  try {
    lastIdx = parseInt(sessionStorage.getItem(WELCOME_Q_STORAGE_KEY) ?? '-1', 10);
  } catch {}

  let idx: number;
  do {
    idx = Math.floor(Math.random() * WELCOME_QUESTIONS.length);
  } while (idx === lastIdx && WELCOME_QUESTIONS.length > 1);

  try {
    sessionStorage.setItem(WELCOME_Q_STORAGE_KEY, String(idx));
  } catch {}

  return WELCOME_QUESTIONS[idx];
}

export const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeQuestion, setWelcomeQuestion] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastQuery, setLastQuery] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 5-second delayed welcome invitation with session persistence (Phase 24 + Phase 25)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isDismissed = false;
    try {
      isDismissed =
        sessionStorage.getItem('techhacks_assistant_welcome_dismissed') === 'true' ||
        sessionStorage.getItem('techhacks_welcome_dismissed') === 'true';
    } catch {}

    if (isDismissed || isOpen) return;

    const timer = setTimeout(() => {
      try {
        const currentDismissed =
          sessionStorage.getItem('techhacks_assistant_welcome_dismissed') === 'true' ||
          sessionStorage.getItem('techhacks_welcome_dismissed') === 'true';
        if (!currentDismissed && !isOpen) {
          setWelcomeQuestion(pickWelcomeQuestion());
          setShowWelcome(true);
        }
      } catch {
        if (!isOpen) {
          setWelcomeQuestion(pickWelcomeQuestion());
          setShowWelcome(true);
        }
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const dismissWelcome = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setShowWelcome(false);
    try {
      sessionStorage.setItem('techhacks_assistant_welcome_dismissed', 'true');
    } catch {}
  };

  const handleOpenFromWelcome = () => {
    dismissWelcome();
    setIsOpen(true);
  };

  const handleOpenChat = () => {
    if (showWelcome) dismissWelcome();
    setIsOpen(true);
  };

  /**
   * Handle user clicking the curated question in the welcome bubble.
   * Opens the chat panel and sends the question through the real chatbot pipeline.
   */
  const handleSendWelcomeQuestion = (e: React.MouseEvent) => {
    e.stopPropagation();
    const q = welcomeQuestion;
    dismissWelcome();
    setIsOpen(true);
    // Brief delay so the chat panel mounts before the message is dispatched
    setTimeout(() => handleSend(q), 120);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isLoading]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || isLoading) return;

    setErrorMessage(null);
    setLastQuery(textToSend);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // 1. Attempt serverless endpoint /api/chat
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          conversationHistory: messages.slice(-4),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.text) {
          const botMsg: ChatMessage = {
            id: `bot-${Date.now()}`,
            sender: 'assistant',
            text: data.text,
            timestamp: Date.now(),
            suggestions: data.suggestions || ['Ask about another tool', 'Help me choose an AI tool for coding.'],
            groundedTools: data.groundedTools,
          };
          setMessages((prev) => [...prev, botMsg]);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // Gracefully fall through to client grounded catalog engine
    }

    // 2. Client grounded catalog fallback
    setTimeout(() => {
      try {
        const botMsg = generateGroundedResponse(textToSend);
        setMessages((prev) => [...prev, botMsg]);
        setIsLoading(false);
        if (!isOpen) setUnreadCount((c) => c + 1);
      } catch {
        setIsLoading(false);
        setErrorMessage('Unable to process request. Please try again.');
      }
    }, 350);
  };

  const handleClearHistory = () => {
    setMessages([INITIAL_MESSAGE]);
    setErrorMessage(null);
    setLastQuery(null);
  };

  // Helper to parse markdown links and bold formatting
  const renderFormattedText = (content: string) => {
    const lines = content.split('\n');

    return (
      <div className="space-y-1.5 text-xs leading-relaxed text-secondary-foreground">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1" />;

          const parts: React.ReactNode[] = [];
          const regex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
          let lastIndex = 0;
          let match: RegExpExecArray | null;

          while ((match = regex.exec(line)) !== null) {
            if (match.index > lastIndex) {
              parts.push(line.substring(lastIndex, match.index));
            }

            if (match[1] && match[2]) {
              const linkText = match[1];
              const linkUrl = match[2];
              const isInternal = linkUrl.startsWith('/');

              if (isInternal) {
                parts.push(
                  <Link
                    key={`${idx}-${match.index}`}
                    to={linkUrl}
                    className="font-semibold text-primary underline underline-offset-2 hover:text-primary-hover transition-colors inline-flex items-center gap-0.5"
                  >
                    <span>{linkText}</span>
                  </Link>
                );
              } else {
                parts.push(
                  <a
                    key={`${idx}-${match.index}`}
                    href={linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary underline underline-offset-2 hover:text-primary-hover inline-flex items-center gap-0.5"
                  >
                    <span>{linkText}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                );
              }
            } else if (match[3]) {
              parts.push(
                <strong key={`${idx}-${match.index}`} className="font-semibold text-foreground">
                  {match[3]}
                </strong>
              );
            }

            lastIndex = regex.lastIndex;
          }

          if (lastIndex < line.length) {
            parts.push(line.substring(lastIndex));
          }

          return (
            <p key={idx} className="leading-relaxed">
              {parts.length > 0 ? parts : line}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Floating AI Launcher with Elevated Positioning & Safe-Area Padding */}
      <div className="fixed bottom-8 right-5 sm:bottom-10 sm:right-8 z-50 pb-[env(safe-area-inset-bottom)]">
        {/* Delayed Welcome Invitation Popup — Phase 25: curated question per session */}
        {!isOpen && showWelcome && (
          <div
            role="region"
            aria-label="Assistant welcome invitation"
            onClick={handleOpenFromWelcome}
            className="group absolute bottom-full right-0 mb-3 w-[300px] sm:w-[330px] rounded-2xl p-4 bg-card/95 backdrop-blur-2xl border border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.15)] text-foreground animate-fade-in-up z-50 flex flex-col gap-3 cursor-pointer hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] transition-all"
          >
            {/* Header & Dismiss Button */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                </span>
                <h4 className="font-bold text-sm text-foreground leading-tight" title="Need a hand? 👋">
                  Need help finding the right AI tool? 👋
                </h4>
              </div>
              <button
                type="button"
                data-testid="dismiss-welcome-btn"
                onClick={dismissWelcome}
                aria-label="Dismiss assistant invitation"
                className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted/80 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Invitation Body */}
            <p className="text-xs text-secondary-foreground leading-relaxed">
              Tell me what you're looking for. I'll help you find the right AI tools.
            </p>

            {/* Curated Question Chip — clicking it sends the question */}
            {welcomeQuestion && (
              <button
                type="button"
                data-testid="welcome-question-chip"
                onClick={handleSendWelcomeQuestion}
                className="w-full text-left text-xs px-3 py-2.5 rounded-xl border border-cyan-500/25 bg-cyan-500/8 text-cyan-200 hover:bg-cyan-500/15 hover:border-cyan-500/45 transition-all leading-snug font-medium"
              >
                "{welcomeQuestion}"
              </button>
            )}

            {/* Quick action buttons inside bubble */}
            <div className="flex items-center justify-between pt-0.5">
              <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-semibold shadow-sm group-hover:from-cyan-500 group-hover:to-blue-500 transition-all">
                <span>Let's explore</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
              <button
                type="button"
                onClick={dismissWelcome}
                className="py-1 px-2.5 rounded-xl bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-medium transition-colors cursor-pointer"
              >
                Not now
              </button>
            </div>

            {/* Speech bubble pointer notch */}
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-card border-r border-b border-cyan-500/30 transform rotate-45" />
          </div>
        )}

        {!isOpen && (
          <button
            type="button"
            onClick={handleOpenChat}
            aria-label="Open Tech Hacks AI Assistant"
            className="flex items-center gap-3 pl-2.5 pr-4 py-2 rounded-full bg-card/95 border border-cyan-500/30 text-foreground font-semibold text-xs sm:text-sm shadow-2xl shadow-black/40 hover:shadow-cyan-500/25 hover:border-cyan-500/60 hover:scale-105 active:scale-95 transition-all duration-200 group backdrop-blur-2xl cursor-pointer ring-1 ring-cyan-500/20"
          >
            <div className="relative">
              <AiOrb3D
                size="md"
                isGenerating={isLoading}
                hasUnread={unreadCount > 0}
                state={showWelcome ? 'welcome' : undefined}
              />
              <span className="absolute -inset-1 rounded-full bg-cyan-400/20 blur-xs -z-10 group-hover:bg-cyan-400/40 transition-colors" />
            </div>
            <div className="flex flex-col text-left pr-1">
              <span className="font-bold tracking-tight text-foreground flex items-center gap-1.5 leading-none">
                <span>Ask Tech Hacks AI</span>
                <Sparkles className="w-3 h-3 text-cyan-400 opacity-90 group-hover:rotate-12 transition-transform" />
              </span>
              <span className="text-[10px] text-muted-foreground font-normal mt-0.5 leading-none flex items-center gap-1.5">
                <span>Find the right AI tool</span>
                <span className="w-1 h-1 rounded-full bg-cyan-400" />
                <span className="text-cyan-400 font-mono text-[9px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </span>
            </div>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-500 text-slate-950 shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Floating Chat Panel (Desktop Card / Mobile Bottom Sheet) */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Tech Hacks AI Assistant"
          className="fixed bottom-3 right-2 left-2 mx-auto sm:left-auto sm:right-8 sm:bottom-10 z-50 w-[96vw] max-w-[440px] sm:w-[440px] max-h-[86vh] h-[min(650px,calc(100vh-5rem))] flex flex-col rounded-3xl border border-cyan-500/30 bg-card/90 backdrop-blur-2xl shadow-[0_0_40px_rgba(6,182,212,0.18)] shadow-black/60 overflow-hidden animate-fade-in-up transition-all ring-1 ring-cyan-500/20"
        >
          {/* Header with Futuristic Glass UI & Neon Status Badge */}
          <div className="px-4 py-3 border-b border-border/80 bg-muted/40 backdrop-blur-md flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <AiOrb3D
                size="sm"
                isGenerating={isLoading}
                state={errorMessage ? 'error' : isLoading ? 'thinking' : 'idle'}
              />
              <div>
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2 leading-none">
                  <span>Tech Hacks AI Assistant</span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online / Ready
                  </span>
                </h3>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1 font-mono">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" />
                  <span>Verified Catalog • EN / हिंदी</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearHistory}
                title="Restart conversation"
                aria-label="Restart conversation"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-cyan-400 hover:bg-cyan-500/10 active:scale-95 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Minimize assistant"
                aria-label="Minimize assistant"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-xs shadow-md shadow-cyan-900/30 text-xs font-medium'
                      : 'bg-card/90 border border-border/90 text-foreground rounded-bl-xs shadow-sm'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    renderFormattedText(msg.text)
                  )}

                  {/* Grounded Tool Cards */}
                  {msg.groundedTools && msg.groundedTools.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-border/60 space-y-1.5">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                        Verified Catalog Matches:
                      </span>
                      <div className="space-y-1.5">
                        {msg.groundedTools.map((t, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-muted/60 border border-border/70 flex items-center justify-between gap-2 text-xs"
                          >
                            <div className="min-w-0">
                              <Link
                                to={t.type === 'open-source' ? `/tools/${t.slug}` : `/ai-tools/${t.slug}`}
                                className="font-semibold text-foreground hover:text-cyan-400 transition-colors text-xs truncate block"
                              >
                                {t.name}
                              </Link>
                              <span className="text-[10px] text-muted-foreground block truncate">
                                {t.pricingSummary}
                              </span>
                            </div>
                            <Link
                              to={t.type === 'open-source' ? `/tools/${t.slug}` : `/ai-tools/${t.slug}`}
                              className="px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-400 text-[10px] font-semibold hover:bg-cyan-500/25 shrink-0 transition-colors border border-cyan-500/20"
                            >
                              Explore
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Suggestions / Prompt Chips */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[92%]">
                    {msg.suggestions.map((s, sidx) => (
                      <button
                        key={sidx}
                        type="button"
                        onClick={() => handleSend(s)}
                        className="text-[11px] px-3 py-1.5 rounded-full bg-card hover:bg-cyan-500/10 hover:border-cyan-500/40 border border-border text-secondary-foreground hover:text-cyan-300 transition-all text-left shadow-2xs cursor-pointer active:scale-95"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Loading / Generating State with Futuristic Typing Dots */}
            {isLoading && (
              <div className="flex items-center gap-3 text-muted-foreground text-xs p-3.5 rounded-2xl bg-card/90 border border-cyan-500/20 max-w-[85%] shadow-sm">
                <AiOrb3D size="sm" isGenerating={true} state="thinking" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground block text-xs">Consulting Tech Hacks AI...</span>
                    {/* Animated Pulsing Typing Dots */}
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground block">Synthesizing verified catalog & pricing data</span>
                </div>
              </div>
            )}

            {/* Inline Error & Retry */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center justify-between gap-2 animate-fade-in">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                {lastQuery && (
                  <button
                    type="button"
                    onClick={() => handleSend(lastQuery)}
                    className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold text-[11px] transition-colors cursor-pointer"
                  >
                    Retry
                  </button>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Shortcuts Bar */}
          <div className="px-3.5 py-2 bg-muted/20 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5 truncate">
              <MessageSquare className="w-3 h-3 text-primary shrink-0" />
              <span>Grounded in 1,000+ verified tools</span>
            </span>
            <div className="flex items-center gap-3 shrink-0 font-medium">
              <Link to="/compare" className="text-primary hover:underline">
                Compare →
              </Link>
              <Link to="/pick" className="text-primary hover:underline">
                Help Me Pick →
              </Link>
            </div>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-border/80 bg-card/95 backdrop-blur-md flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything in English or Hindi..."
              aria-label="Type your message to Tech Hacks AI Assistant"
              className="flex-1 bg-muted/70 border border-border/80 rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500/70 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 cursor-pointer shadow-md shadow-cyan-900/20 active:scale-95"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
