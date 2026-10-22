import React from 'react';
import { Link } from '../router/Router';
import { Github, Heart, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-card/30 mt-20 pt-12 pb-16 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Discovery callout */}
        <div className="max-w-xl mx-auto text-center mb-12 p-8 rounded-xl border border-border bg-card/60">
          <h2 className="text-xl font-bold text-foreground mb-2">
            Find your next useful tool
          </h2>
          <p className="text-sm text-secondary-foreground mb-5">
            Explore recent discoveries, practical utilities, and open-source alternatives in one directory.
          </p>
          <Link to="/discoveries" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            Browse recent discoveries <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-t border-border/50 text-sm">
          <div>
            <h3 className="font-semibold text-foreground mb-3 text-xs uppercase tracking-wider">
              Browse Software
            </h3>
            <ul className="space-y-2 text-muted-foreground text-xs">
              <li>
                <Link to="/discoveries" className="hover:text-foreground text-primary font-medium">
                  Daily Discoveries
                </Link>
              </li>
              <li>
                <Link to="/tools" className="hover:text-foreground">
                  All Open Source Tools
                </Link>
              </li>
              <li>
                <Link to="/ai-tools" className="hover:text-foreground">
                  AI Tools Directory
                </Link>
              </li>
              <li>
                <Link to="/free-tools" className="hover:text-foreground">
                  Utility Tools
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
              <li>
                <Link to="/offers" className="hover:text-foreground text-primary font-medium">
                  AI Deals &amp; Student Benefits
                </Link>
              </li>
              <li>
                <Link to="/submit-tool" className="hover:text-foreground text-primary font-medium">
                  Submit an AI Tool
                </Link>
              </li>
              <li>
                <Link to="/submit-guide" className="hover:text-foreground">
                  Submit a Guide
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3 text-xs uppercase tracking-wider">
              Popular Categories
            </h3>
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
            <h3 className="font-semibold text-foreground mb-3 text-xs uppercase tracking-wider">
              Alternatives
            </h3>
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
            <h3 className="font-semibold text-foreground mb-3 text-xs uppercase tracking-wider">
              Editorial &amp; Legal
            </h3>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              SwitchRoute is an independent discovery directory for free AI plans, open-source software, browser utilities, prompts, practical guides, and current offers.
            </p>
            <ul className="space-y-1.5 text-muted-foreground text-xs mb-3">
              <li>
                <Link to="/about" className="hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-foreground">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-foreground">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/disclosure" className="hover:text-foreground">
                  Affiliate &amp; Ad Disclosure
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new Event('open_cookie_preferences_modal'));
                    }
                  }}
                  className="hover:text-foreground text-left cursor-pointer transition-colors"
                >
                  Cookie Preferences
                </button>
              </li>
              <li>
                <Link to="/moderation" className="hover:text-foreground text-[11px] text-muted-foreground">
                  Moderation Queue
                </Link>
              </li>
            </ul>
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

        {/* Legal & Policy Navigation Strip */}
        <div className="py-4 border-t border-border/40 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-muted-foreground">
          <Link to="/about" className="hover:text-foreground transition-colors">
            About Us
          </Link>
          <span>•</span>
          <Link to="/contact" className="hover:text-foreground transition-colors">
            Contact
          </Link>
          <span>•</span>
          <Link to="/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link to="/terms" className="hover:text-foreground transition-colors">
            Terms of Use
          </Link>
          <span>•</span>
          <Link to="/disclosure" className="hover:text-foreground transition-colors">
            Affiliate Disclosure
          </Link>
          <span>•</span>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('open_cookie_preferences_modal'));
              }
            }}
            className="hover:text-foreground transition-colors underline cursor-pointer"
          >
            Cookie Preferences
          </button>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-4 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} SwitchRoute. Built with open web standards.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for the AI &amp; open-source community
          </p>
        </div>
      </div>
    </footer>
  );
};
