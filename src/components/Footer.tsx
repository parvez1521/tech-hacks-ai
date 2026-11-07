import React from 'react';
import { Link } from '../router/Router';
import { Heart, ArrowRight, Instagram, Mail, Phone } from 'lucide-react';
import { getConfiguredContactOptions } from '../config/contactConfig';

export const Footer: React.FC = () => {
  const contactOptions = getConfiguredContactOptions();
  const contactIcons = {
    phone: Phone,
    instagram: Instagram,
    email: Mail,
  };

  return (
    <footer className="gradient-hairline bg-card/30 mt-20 pt-16 pb-16 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Discovery callout */}
        <div className="max-w-xl mx-auto text-center mb-12 p-8 rounded-xl border border-border bg-card/60">
          <h2 className="text-xl font-bold text-foreground mb-2">
            Find your next useful tool
          </h2>
          <p className="text-sm text-secondary-foreground mb-5">
            Explore recent discoveries, practical utilities, and open-source alternatives in one directory.
          </p>
          <Link to="/discoveries" className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            Browse recent discoveries <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {contactOptions.length > 0 && (
          <section className="mb-8 rounded-xl border border-border/70 bg-card/50 px-5 py-4 sm:px-6" aria-labelledby="footer-contact-heading">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 id="footer-contact-heading" className="text-sm font-bold text-foreground">Contact</h2>
                <p className="mt-1 text-xs text-muted-foreground">Choose a direct way to reach SwitchRoute.</p>
              </div>
              <nav aria-label="Contact options" className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
                {contactOptions.map((option) => {
                  const Icon = contactIcons[option.id];
                  return (
                    <a
                      key={option.id}
                      href={option.href}
                      target={option.external ? '_blank' : undefined}
                      rel={option.external ? 'noopener noreferrer' : undefined}
                      aria-label={`${option.label} SwitchRoute: ${option.display}`}
                      className="inline-flex min-h-11 min-w-0 items-center gap-3 rounded-lg border border-border bg-background/70 px-3.5 py-2 text-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:min-w-48"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      <span className="min-w-0 text-left">
                        <span className="block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{option.label}</span>
                        <span className="block break-all text-xs font-medium">{option.display}</span>
                      </span>
                    </a>
                  );
                })}
              </nav>
            </div>
          </section>
        )}

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-t border-border/50 text-sm">
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-xs uppercase tracking-widest">
              Browse Software
            </h3>
            <ul className="space-y-2 text-muted-foreground text-xs">
              <li>
                <Link to="/discoveries" className="hover:text-foreground text-primary font-medium">
                  Daily Discoveries
                </Link>
              </li>
              <li>
                <Link to="/tools" className="transition-colors duration-200 hover:text-primary">
                  All Open Source Tools
                </Link>
              </li>
              <li>
                <Link to="/ai-tools" className="transition-colors duration-200 hover:text-primary">
                  AI Tools Directory
                </Link>
              </li>
              <li>
                <Link to="/free-tools" className="transition-colors duration-200 hover:text-primary">
                  Utility Tools
                </Link>
              </li>
              <li>
                <Link to="/alternatives" className="transition-colors duration-200 hover:text-primary">
                  Proprietary Alternatives
                </Link>
              </li>
              <li>
                <Link to="/categories" className="transition-colors duration-200 hover:text-primary">
                  Browse by Category
                </Link>
              </li>
              <li>
                <Link to="/collections/trending" className="transition-colors duration-200 hover:text-primary">
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
                <Link to="/submit-guide" className="transition-colors duration-200 hover:text-primary">
                  Submit a Guide
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4 text-xs uppercase tracking-widest">
              Popular Categories
            </h3>
            <ul className="space-y-2 text-muted-foreground text-xs">
              <li>
                <Link to="/categories/developer-tools" className="transition-colors duration-200 hover:text-primary">
                  Developer Tools
                </Link>
              </li>
              <li>
                <Link to="/categories/ai-machine-learning" className="transition-colors duration-200 hover:text-primary">
                  AI & Machine Learning
                </Link>
              </li>
              <li>
                <Link to="/categories/productivity" className="transition-colors duration-200 hover:text-primary">
                  Productivity & Notes
                </Link>
              </li>
              <li>
                <Link to="/categories/analytics" className="transition-colors duration-200 hover:text-primary">
                  Analytics & Metrics
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4 text-xs uppercase tracking-widest">
              Alternatives
            </h3>
            <ul className="space-y-2 text-muted-foreground text-xs">
              <li>
                <Link to="/alternatives/notion" className="transition-colors duration-200 hover:text-primary">
                  Notion Alternatives
                </Link>
              </li>
              <li>
                <Link to="/alternatives/firebase" className="transition-colors duration-200 hover:text-primary">
                  Firebase Alternatives
                </Link>
              </li>
              <li>
                <Link to="/alternatives/airtable" className="transition-colors duration-200 hover:text-primary">
                  Airtable Alternatives
                </Link>
              </li>
              <li>
                <Link to="/alternatives/figma" className="transition-colors duration-200 hover:text-primary">
                  Figma Alternatives
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4 text-xs uppercase tracking-widest">
              Editorial &amp; Legal
            </h3>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              SwitchRoute is an independent discovery directory for free AI plans, open-source software, browser utilities, prompts, practical guides, and current offers.
            </p>
            <ul className="space-y-1.5 text-muted-foreground text-xs mb-3">
              <li>
                <Link to="/brand-kit" className="transition-colors duration-200 hover:text-primary">
                  Brand Kit
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition-colors duration-200 hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition-colors duration-200 hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="transition-colors duration-200 hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="transition-colors duration-200 hover:text-primary">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/disclosure" className="transition-colors duration-200 hover:text-primary">
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
                  className="hover:text-primary text-left cursor-pointer transition-colors duration-200"
                >
                  Cookie Preferences
                </button>
              </li>
              <li>
                <Link to="/moderation" className="transition-colors duration-200 hover:text-primary text-[11px] text-muted-foreground">
                  Moderation Queue
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Policy Navigation Strip */}
        <div className="py-4 border-t border-border/40 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-muted-foreground">
          <Link to="/about" className="hover:text-primary transition-colors duration-200">
            About Us
          </Link>
          <span>•</span>
          <Link to="/contact" className="hover:text-primary transition-colors duration-200">
            Contact
          </Link>
          <span>•</span>
          <Link to="/privacy" className="hover:text-primary transition-colors duration-200">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link to="/terms" className="hover:text-primary transition-colors duration-200">
            Terms of Use
          </Link>
          <span>•</span>
          <Link to="/disclosure" className="hover:text-primary transition-colors duration-200">
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
            className="hover:text-primary transition-colors duration-200 underline cursor-pointer"
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
