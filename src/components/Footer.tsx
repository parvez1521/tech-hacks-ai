import React, { useState } from 'react';
import { Link } from '../router/Router';
import { Mail, CheckCircle, Github, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="border-t border-border bg-card/30 mt-20 pt-12 pb-16 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Newsletter Box */}
        <div className="max-w-xl mx-auto text-center mb-12 p-8 rounded-xl border border-border bg-card/60">
          <h3 className="text-xl font-bold text-foreground mb-2">
            Subscribe to our newsletter
          </h3>
          <p className="text-sm text-secondary-foreground mb-5">
            Every week we deconstruct one proprietary app and review the best open source alternatives worth switching to.
          </p>

          {isSubscribed ? (
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              <span>Thank you for subscribing! Check your inbox for confirmation.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-primary-foreground font-medium text-sm transition-colors shrink-0 shadow-sm cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="text-xs text-muted-foreground mt-3">
            Trusted by 12,000+ developers and engineering teams worldwide.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-t border-border/50 text-sm">
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-xs uppercase tracking-wider">
              Browse Software
            </h4>
            <ul className="space-y-2 text-muted-foreground text-xs">
              <li>
                <Link to="/tools" className="hover:text-foreground">
                  All Open Source Tools
                </Link>
              </li>
              <li>
                <Link to="/alternatives" className="hover:text-foreground">
                  Proprietary Alternatives
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-foreground">
                  Browse by Category
                </Link>
              </li>
              <li>
                <Link to="/collections/trending" className="hover:text-foreground">
                  Trending Projects
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3 text-xs uppercase tracking-wider">
              Popular Categories
            </h4>
            <ul className="space-y-2 text-muted-foreground text-xs">
              <li>
                <Link to="/categories/developer-tools" className="hover:text-foreground">
                  Developer Tools
                </Link>
              </li>
              <li>
                <Link to="/categories/ai-machine-learning" className="hover:text-foreground">
                  AI & Machine Learning
                </Link>
              </li>
              <li>
                <Link to="/categories/productivity" className="hover:text-foreground">
                  Productivity & Notes
                </Link>
              </li>
              <li>
                <Link to="/categories/analytics" className="hover:text-foreground">
                  Analytics & Metrics
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3 text-xs uppercase tracking-wider">
              Alternatives
            </h4>
            <ul className="space-y-2 text-muted-foreground text-xs">
              <li>
                <Link to="/alternatives/notion" className="hover:text-foreground">
                  Notion Alternatives
                </Link>
              </li>
              <li>
                <Link to="/alternatives/firebase" className="hover:text-foreground">
                  Firebase Alternatives
                </Link>
              </li>
              <li>
                <Link to="/alternatives/airtable" className="hover:text-foreground">
                  Airtable Alternatives
                </Link>
              </li>
              <li>
                <Link to="/alternatives/figma" className="hover:text-foreground">
                  Figma Alternatives
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3 text-xs uppercase tracking-wider">
              About Project
            </h4>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              Tech Hacks AI is a curated discovery platform indexing the top generative AI tools, verified free software, open-source alternatives, step-by-step guides, and developer utilities.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Tech Hacks AI. Built with open web standards.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for the AI &amp; open-source community
          </p>
        </div>
      </div>
    </footer>
  );
};
