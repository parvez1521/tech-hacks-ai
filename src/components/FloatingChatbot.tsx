import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, RefreshCw, ChevronDown, ExternalLink, ShieldCheck, ArrowRight, MessageSquare } from 'lucide-react';
import { generateGroundedResponse, ChatMessage } from '../services/chatRetrievalService.ts';
import { Link } from '../router/Router.tsx';

const INITIAL_MESSAGE: ChatMessage = {
  id: 'bot-welcome',
  sender: 'assistant',
  timestamp: Date.now(),
  text: `**Namaste & Welcome to Tech Hacks AI Assistant!** 🚀\n\n` +
    `I can help you discover verified AI tools, find free video & image generators, explore LLM alternatives, and locate self-hostable open-source software.\n\n` +
    `Ask in **English** or **Hindi/Hinglish** (e.g., *"Best free AI video tools"*, *"Coding ke liye best free tool"*, or *"Does Pika have a recurring free plan?"*).`,
  suggestions: [
    'Best free AI video generators',
    'Claude 3.5 Sonnet alternatives',
    'Does Pika have a free plan?',
    'Open-source Notion replacement',
  ],
};

export const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || isLoading) return;

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
      // 1. Attempt to call server endpoint /api/chat
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
            suggestions: data.suggestions || ['Ask about other tools', 'Help me pick a tool'],
            groundedTools: data.groundedTools,
          };
          setMessages((prev) => [...prev, botMsg]);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // Fall through to local grounded catalog service on network or API failure
    }

    // 2. Seamless local grounded catalog engine fallback
    setTimeout(() => {
      const botMsg = generateGroundedResponse(textToSend);
      setMessages((prev) => [...prev, botMsg]);
      setIsLoading(false);
      if (!isOpen) setUnreadCount((c) => c + 1);
    }, 400);
  };

  const handleClearHistory = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  // Helper to parse markdown links and bold formatting into interactive elements
  const renderFormattedText = (content: string) => {
    const lines = content.split('\n');

    return (
      <div className="space-y-1.5 text-xs leading-relaxed text-secondary-foreground">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1" />;

          // Parse markdown link: [text](url) and bold: **text**
          const parts: React.ReactNode[] = [];
          const regex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
          let lastIndex = 0;
          let match: RegExpExecArray | null;

          while ((match = regex.exec(line)) !== null) {
            if (match.index > lastIndex) {
              parts.push(line.substring(lastIndex, match.index));
            }

            if (match[1] && match[2]) {
              // Markdown link
              const linkText = match[1];
              const linkUrl = match[2];
              const isInternal = linkUrl.startsWith('/');

              if (isInternal) {
                parts.push(
                  <Link
                    key={`${idx}-${match.index}`}
                    to={linkUrl}
                    className="font-semibold text-primary underline underline-offset-2 hover:text-primary-hover transition-colors"
                  >
                    {linkText}
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
              // Bold text
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
      {/* Floating launcher button */}
      <div className="fixed bottom-5 right-5 z-50">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open Tech Hacks AI Assistant"
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-xl hover:shadow-primary/30 hover:scale-105 active:scale-95 transition-all duration-200 group border border-primary/20 backdrop-blur-sm"
          >
            <div className="relative">
              <Bot className="w-5 h-5 transition-transform group-hover:rotate-6" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse border-2 border-background" />
            </div>
            <span className="font-medium tracking-tight">Ask Tech Hacks AI</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-white text-primary">
                {unreadCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Floating Chat Modal Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Tech Hacks AI Assistant"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[92vw] sm:w-[420px] max-h-[82vh] h-[640px] flex flex-col rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="px-4 py-3.5 border-b border-border bg-muted/40 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary relative">
                <Sparkles className="w-4 h-4" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5 leading-none">
                  <span>Tech Hacks AI Assistant</span>
                </h3>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1 font-mono">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Catalog Grounded • EN / हिंदी</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearHistory}
                title="Clear conversation"
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                      ? 'bg-primary text-primary-foreground rounded-br-xs shadow-sm text-xs'
                      : 'bg-muted/60 border border-border/80 text-foreground rounded-bl-xs shadow-sm'
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
                      <div className="space-y-1">
                        {msg.groundedTools.map((t, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded-lg bg-card/80 border border-border/60 flex items-center justify-between gap-2 text-xs"
                          >
                            <div>
                              <Link
                                to={t.type === 'open-source' ? `/tools/${t.slug}` : `/ai-tools/${t.slug}`}
                                className="font-semibold text-foreground hover:text-primary transition-colors text-xs"
                              >
                                {t.name}
                              </Link>
                              <span className="text-[10px] text-muted-foreground block">
                                {t.pricingSummary}
                              </span>
                            </div>
                            <Link
                              to={t.type === 'open-source' ? `/tools/${t.slug}` : `/ai-tools/${t.slug}`}
                              className="px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-semibold hover:bg-primary/20 shrink-0"
                            >
                              Explore
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Suggestions chips */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                    {msg.suggestions.map((s, sidx) => (
                      <button
                        key={sidx}
                        type="button"
                        onClick={() => handleSend(s)}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-card/80 hover:bg-primary/10 hover:border-primary/40 border border-border text-secondary-foreground hover:text-primary transition-all text-left"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground text-xs p-3 rounded-xl bg-muted/40 border border-border/50 max-w-[70%] animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-primary animate-spin" />
                <span>Searching verified catalog...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Shortcuts Bar */}
          <div className="px-3 py-1.5 bg-muted/20 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1 truncate">
              <MessageSquare className="w-3 h-3 text-primary shrink-0" />
              <span>Grounded in Tech Hacks AI catalog</span>
            </span>
            <Link to="/pick" className="text-primary hover:underline font-semibold shrink-0">
              Interactive Wizard →
            </Link>
          </div>

          {/* Input form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-border bg-card/90 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything in English or Hindi..."
              className="flex-1 bg-muted/60 border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
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
