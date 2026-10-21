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
import { selectProactiveSuggestion } from '../services/proactiveSuggestionService.ts';
import type { ProactiveSuggestion } from '../services/proactiveSuggestionService.ts';
import { Link } from '../router/Router.tsx';
import { AiOrb3D } from './AiOrb3D.tsx';
import { BrandLogo } from './BrandLogo.tsx';

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
  timestamp: 0,
  text:
    '**Welcome to the Tech Hacks AI assistant.**\n\n' +
    'I can help you find verified AI tools, open-source alternatives, practical guides, and current student or free-access options. Ask in English or Hindi/Hinglish.',
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
  'What are some practical AI tools for video editing?',
] as const;

function createProactiveAssistantMessage(suggestion: ProactiveSuggestion): ChatMessage {
  return {
    id: `proactive-${suggestion.id}`,
    sender: 'assistant',
    timestamp: 0,
    text: `**A useful place to start:**\n\n${suggestion.description}`,
    suggestions: [suggestion.prompt],
  };
}

export const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeQuestion, setWelcomeQuestion] = useState('');
  const [proactiveSuggestion, setProactiveSuggestion] = useState<ProactiveSuggestion | null>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastQuery, setLastQuery] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [serviceNotice, setServiceNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const proactiveMessageRef = useRef<ChatMessage | null>(null);
  const proactiveInitializedRef = useRef(false);
  const isOpenRef = useRef(false);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  // Select once per mounted assistant. The selection is local, immediate, and
  // guarded so React StrictMode or route updates cannot duplicate the message.
  useEffect(() => {
    if (typeof window === 'undefined' || proactiveInitializedRef.current) return;
    proactiveInitializedRef.current = true;

    const selected = selectProactiveSuggestion();
    const proactiveMessage = createProactiveAssistantMessage(selected);
    proactiveMessageRef.current = proactiveMessage;
    setProactiveSuggestion(selected);
    setWelcomeQuestion(selected.prompt);
    setShowWelcome(true);
    setMessages((previous) =>
      previous.some((message) => message.id === proactiveMessage.id)
        ? previous
        : [...previous, proactiveMessage]
    );
  }, []);

  const dismissWelcome = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setShowWelcome(false);
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
    void handleSend(q, { suppressUnread: true });
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

  const handleSend = async (
    queryText?: string,
    options: { suppressUnread?: boolean } = {}
  ) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || isLoadingRef.current) return;
    if (textToSend.length > 8000) {
      setErrorMessage('Please keep messages under 8,000 characters.');
      return;
    }

    setErrorMessage(null);
    setServiceNotice(null);
    setLastQuery(textToSend);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    isLoadingRef.current = true;
    setIsLoading(true);

    let useCatalogFallback = false;
    let timeoutId: number | undefined;
    try {
      // Provider keys stay on the server; an unconfigured or unavailable API
      // explicitly signals that the local catalogue will answer this request.
      const controller = new AbortController();
      timeoutId = window.setTimeout(() => controller.abort(), 22000);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          message: textToSend,
          conversationHistory: messages.slice(-4),
        }),
      });
      window.clearTimeout(timeoutId);

      const data = await response.json().catch(() => null);
      if (!response.ok && [400, 413, 429].includes(response.status)) {
        setErrorMessage(typeof data?.error === 'string' ? data.error : 'Please check your message and try again.');
        isLoadingRef.current = false;
        setIsLoading(false);
        return;
      }
      if (response.ok && typeof data?.text === 'string' && data.text.trim()) {
          const botMsg: ChatMessage = {
            id: `bot-${Date.now()}`,
            sender: 'assistant',
            text: data.text.trim(),
            timestamp: Date.now(),
            suggestions: Array.isArray(data.suggestions) ? data.suggestions : ['Ask about another tool', 'Help me choose an AI tool for coding.'],
            groundedTools: data.groundedTools,
          };
          setMessages((prev) => [...prev, botMsg]);
          isLoadingRef.current = false;
          setIsLoading(false);
          return;
      }
      if (data?.status === 'grounded_local_mode' && typeof data.message === 'string') {
        setServiceNotice(data.message);
      } else {
        useCatalogFallback = true;
      }
    } catch {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      useCatalogFallback = true;
      setServiceNotice('Chat service is unavailable. Showing matches from the published catalogue.');
    }

    // Published catalogue retrieval is a real local feature, clearly identified
    // when no live provider response was received.
    try {
      if (useCatalogFallback) {
        setServiceNotice((notice) => notice || 'Live AI is unavailable. Showing matches from the published catalogue.');
      }
      const botMsg = generateGroundedResponse(textToSend);
      setMessages((prev) => [...prev, botMsg]);
      if (!options.suppressUnread && !isOpenRef.current) setUnreadCount((c) => c + 1);
    } catch {
      setErrorMessage('Unable to process this request. Please try again.');
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      INITIAL_MESSAGE,
      ...(proactiveMessageRef.current ? [proactiveMessageRef.current] : []),
    ]);
    setErrorMessage(null);
    setServiceNotice(null);
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
        {/* Immediate, compact starting-point suggestion */}
        {!isOpen && showWelcome && (
          <div
            role="region"
            aria-label="Assistant welcome invitation"
            onClick={handleOpenFromWelcome}
            className="group absolute bottom-full right-0 mb-3 w-[min(330px,calc(100vw-2rem))] rounded-lg p-4 bg-card border border-border shadow-lg shadow-black/30 text-foreground animate-fade-in-up z-50 hidden lg:flex flex-col gap-3 cursor-pointer hover:border-primary/50 transition-colors"
          >
            {/* Header & Dismiss Button */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-primary/10 text-primary border border-primary/20">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
                <h4 className="font-semibold text-sm text-foreground leading-tight">
                  A useful place to start
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

            {/* Recommendations come from the local published catalogue or a real directory route. */}
            {proactiveSuggestion?.tool ? (
              <div className="flex items-start gap-2.5 p-2.5 rounded-md bg-muted/50 border border-border/80">
                <BrandLogo
                  slug={proactiveSuggestion.tool.slug}
                  name={proactiveSuggestion.tool.name}
                  size="sm"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {proactiveSuggestion.tool.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                    {proactiveSuggestion.description}
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs font-semibold text-foreground">
                  {proactiveSuggestion?.title || 'Tell me what you need'}
                </p>
                <p className="text-xs text-secondary-foreground leading-relaxed mt-1">
                  {proactiveSuggestion?.description || 'I can help you find a practical tool without the hype.'}
                </p>
              </div>
            )}

            {/* Curated Question Chip — clicking it sends the question */}
            {welcomeQuestion && (
              <button
                type="button"
                data-testid="welcome-question-chip"
                onClick={handleSendWelcomeQuestion}
                className="w-full text-left text-xs px-3 py-2.5 rounded-md border border-primary/25 bg-primary/10 text-primary hover:bg-primary/15 hover:border-primary/45 transition-colors leading-snug font-medium"
              >
                {welcomeQuestion}
              </button>
            )}

            {/* Quick action buttons inside bubble */}
            <div className="flex items-center justify-between pt-0.5">
              <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-md bg-primary text-primary-foreground text-xs font-semibold">
                <span>Open assistant</span>
                <ArrowRight className="w-3 h-3" />
              </span>
              <button
                type="button"
                onClick={dismissWelcome}
                className="py-1 px-2.5 rounded-md bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-medium transition-colors cursor-pointer"
              >
                Not now
              </button>
            </div>

            {/* Speech bubble pointer notch */}
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-card border-r border-b border-border transform rotate-45" />
          </div>
        )}

        {!isOpen && (
          <button
            type="button"
            onClick={handleOpenChat}
            className="flex items-center gap-3 pl-2.5 pr-4 py-2 rounded-lg bg-card border border-border text-foreground font-semibold text-xs sm:text-sm shadow-lg shadow-black/30 hover:border-primary/50 hover:bg-muted active:scale-[0.98] transition-colors duration-200 group cursor-pointer"
          >
            <div className="relative">
              <AiOrb3D
                size="md"
                isGenerating={isLoading}
                hasUnread={unreadCount > 0}
                state={showWelcome ? 'welcome' : undefined}
              />
            </div>
            <div className="flex flex-col text-left pr-1">
              <span className="font-bold tracking-tight text-foreground flex items-center gap-1.5 leading-none">
                <span>Ask Tech Hacks AI</span>
                <Sparkles className="w-3 h-3 text-primary opacity-90" />
              </span>
              <span className="text-[10px] text-muted-foreground font-normal mt-0.5 leading-none flex items-center gap-1.5">
                <span>Find the right AI tool</span>
                <span className="w-1 h-1 rounded-full bg-primary" />
                <span className="text-primary font-mono text-[9px] flex items-center gap-1">
                  Catalog assistant
                </span>
              </span>
            </div>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-primary text-primary-foreground">
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
           className="fixed bottom-3 right-2 left-2 mx-auto sm:left-auto sm:right-8 sm:bottom-10 z-50 w-[96vw] max-w-[440px] sm:w-[440px] max-h-[86vh] h-[min(650px,calc(100vh-5rem))] flex flex-col rounded-xl border border-border bg-card shadow-xl shadow-black/40 overflow-hidden animate-fade-in-up"
        >
          {/* Header stays compact and opaque so the conversation remains the focus. */}
          <div className="px-4 py-3 border-b border-border/80 bg-muted/40 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <AiOrb3D
                size="sm"
                isGenerating={isLoading}
                state={errorMessage ? 'error' : isLoading ? 'thinking' : 'idle'}
              />
              <div>
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2 leading-none">
                  <span>Tech Hacks AI Assistant</span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-[9px] font-mono text-primary">
                    Catalog
                  </span>
                </h3>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1 font-mono">
                  <ShieldCheck className="w-3 h-3 text-primary" />
                  <span>Published tools • EN / हिंदी</span>
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
                    className={`max-w-[88%] p-3.5 rounded-lg ${
                      msg.sender === 'user'
                       ? 'bg-primary text-primary-foreground rounded-br-sm text-xs font-medium'
                       : 'bg-muted/50 border border-border/90 text-foreground rounded-bl-sm'
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
                            className="p-2.5 rounded-md bg-card border border-border/70 flex items-center justify-between gap-2 text-xs"
                          >
                            <div className="min-w-0 flex items-center gap-2">
                              <BrandLogo slug={t.slug} name={t.name} size="xs" />
                              <div className="min-w-0">
                                <Link
                                  to={t.type === 'open-source' ? `/tools/${t.slug}` : `/ai-tools/${t.slug}`}
                                  className="font-semibold text-foreground hover:text-primary transition-colors text-xs truncate block"
                                >
                                  {t.name}
                                </Link>
                                <span className="text-[10px] text-muted-foreground block truncate">
                                  {t.pricingSummary}
                                </span>
                              </div>
                            </div>
                            <Link
                              to={t.type === 'open-source' ? `/tools/${t.slug}` : `/ai-tools/${t.slug}`}
                              className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-semibold hover:bg-primary/20 shrink-0 transition-colors border border-primary/20"
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
                        className="text-[11px] px-3 py-1.5 rounded-md bg-card hover:bg-primary/10 hover:border-primary/40 border border-border text-secondary-foreground hover:text-primary transition-colors text-left cursor-pointer active:scale-[0.98]"
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
              <div className="flex items-center gap-3 text-muted-foreground text-xs p-3.5 rounded-lg bg-muted/50 border border-border max-w-[85%]">
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

            {serviceNotice && !errorMessage && (
              <p role="status" className="mx-1 text-[11px] leading-relaxed text-muted-foreground">
                {serviceNotice}
              </p>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Shortcuts Bar */}
          <div className="px-3.5 py-2 bg-muted/20 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5 truncate">
              <MessageSquare className="w-3 h-3 text-primary shrink-0" />
              <span>Grounded in the published catalogue</span>
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
            className="p-3 border-t border-border/80 bg-card flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything in English or Hindi..."
              aria-label="Type your message to Tech Hacks AI Assistant"
              className="flex-1 bg-muted/70 border border-border/80 rounded-md px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/70 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-md bg-primary hover:bg-primary-hover text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0 cursor-pointer active:scale-[0.98]"
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
