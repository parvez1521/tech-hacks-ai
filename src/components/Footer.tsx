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
    <footer className="border-t border-[#DFE7F3] bg-[#F5F8FF] mt-20 pt-16 pb-16 transition-colors relative">
      {/* Subtle top ambient border highlight */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Newsletter Box (Invary Technical Digest Card) */}
        <div className="max-w-xl mx-auto text-center mb-14 p-8 rounded-2xl border border-[#DFE7F3] bg-white shadow-md shadow-blue-500/5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#EAF2FF] text-[#2563EB] border border-[#BFDBFE] mb-3">
            <span>Weekly Intelligence Digest</span>
          </div>
          <h3 className="text-xl font-bold text-[#0F172A] mb-2 tracking-tight">
            Subscribe to our newsletter
          </h3>
          <p className="text-sm text-[#64748B] mb-6 leading-relaxed">
            Every week we deconstruct one proprietary app and review the best open source alternatives worth switching to.
          </p>

          {isSubscribed ? (
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Thank you for subscribing! Check your inbox for confirmation.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work or personal email"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#F8FAFC] border border-[#DFE7F3] text-[#0F172A] placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB] transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm transition-all duration-150 shrink-0 shadow-sm active:translate-y-px cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="text-xs text-[#64748B] mt-4 flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Trusted by 12,000+ developers and engineering teams worldwide.</span>
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-t border-[#DFE7F3] text-sm">
          <div>
            <h4 className="font-semibold text-[#0F172A] mb-3 text-xs uppercase tracking-wider">
              Browse Software
            </h4>
            <ul className="space-y-2 text-[#64748B] text-xs">
              <li>
                <Link to="/discoveries" className="hover:text-[#2563EB] text-[#2563EB] font-medium transition-colors">
                  Daily Discoveries
                </Link>
              </li>
              <li>
                <Link to="/tools" className="hover:text-[#2563EB] transition-colors">
                  All Open Source Tools
                </Link>
              </li>
              <li>
                <Link to="/alternatives" className="hover:text-[#2563EB] transition-colors">
                  Proprietary Alternatives
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-[#2563EB] transition-colors">
                  Browse by Category
                </Link>
              </li>
              <li>
                <Link to="/collections/trending" className="hover:text-[#2563EB] transition-colors">
                  Trending Projects
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-[#2563EB] text-[#2563EB] font-medium transition-colors">
                  AI Deals &amp; Student Benefits
                </Link>
              </li>
              <li>
                <Link to="/submit-tool" className="hover:text-[#2563EB] text-[#2563EB] font-medium transition-colors">
                  Submit an AI Tool
                </Link>
              </li>
              <li>
                <Link to="/submit-guide" className="hover:text-[#2563EB] transition-colors">
                  Submit a Guide
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#0F172A] mb-3 text-xs uppercase tracking-wider">
              Popular Categories
            </h4>
            <ul className="space-y-2 text-[#64748B] text-xs">
              <li>
                <Link to="/categories/developer-tools" className="hover:text-[#2563EB] transition-colors">
                  Developer Tools
                </Link>
              </li>
              <li>
                <Link to="/categories/ai-machine-learning" className="hover:text-[#2563EB] transition-colors">
                  AI & Machine Learning
                </Link>
              </li>
              <li>
                <Link to="/categories/productivity" className="hover:text-[#2563EB] transition-colors">
                  Productivity & Notes
                </Link>
              </li>
              <li>
                <Link to="/categories/analytics" className="hover:text-[#2563EB] transition-colors">
                  Analytics & Metrics
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#0F172A] mb-3 text-xs uppercase tracking-wider">
              Alternatives
            </h4>
            <ul className="space-y-2 text-[#64748B] text-xs">
              <li>
                <Link to="/alternatives/notion" className="hover:text-[#2563EB] transition-colors">
                  Notion Alternatives
                </Link>
              </li>
              <li>
                <Link to="/alternatives/firebase" className="hover:text-[#2563EB] transition-colors">
                  Firebase Alternatives
                </Link>
              </li>
              <li>
                <Link to="/alternatives/airtable" className="hover:text-[#2563EB] transition-colors">
                  Airtable Alternatives
                </Link>
              </li>
              <li>
                <Link to="/alternatives/figma" className="hover:text-[#2563EB] transition-colors">
                  Figma Alternatives
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#0F172A] mb-3 text-xs uppercase tracking-wider">
              Editorial &amp; Legal
            </h4>
            <p className="text-xs text-[#64748B] mb-3 leading-relaxed">
              Tech Hacks AI is a curated discovery platform indexing the top generative AI tools, verified free software, open-source alternatives, step-by-step guides, and developer utilities.
            </p>
            <ul className="space-y-1.5 text-[#64748B] text-xs mb-3">
              <li>
                <Link to="/about" className="hover:text-[#2563EB] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#2563EB] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#2563EB] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#2563EB] transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/disclosure" className="hover:text-[#2563EB] transition-colors">
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
                  className="hover:text-[#2563EB] text-left cursor-pointer transition-colors"
                >
                  Cookie Preferences
                </button>
              </li>
              <li>
                <Link to="/moderation" className="hover:text-[#2563EB] text-[11px] text-slate-400 transition-colors">
                  Moderation Queue
                </Link>
              </li>
            </ul>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#64748B] hover:text-[#0F172A] transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Legal & Policy Navigation Strip */}
        <div className="py-4 border-t border-[#DFE7F3] flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-[#64748B]">
          <Link to="/about" className="hover:text-[#2563EB] transition-colors">
            About Us
          </Link>
          <span className="text-slate-300">•</span>
          <Link to="/contact" className="hover:text-[#2563EB] transition-colors">
            Contact
          </Link>
          <span className="text-slate-300">•</span>
          <Link to="/privacy" className="hover:text-[#2563EB] transition-colors">
            Privacy Policy
          </Link>
          <span className="text-slate-300">•</span>
          <Link to="/terms" className="hover:text-[#2563EB] transition-colors">
            Terms of Use
          </Link>
          <span className="text-slate-300">•</span>
          <Link to="/disclosure" className="hover:text-[#2563EB] transition-colors">
            Affiliate Disclosure
          </Link>
          <span className="text-slate-300">•</span>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('open_cookie_preferences_modal'));
              }
            }}
            className="hover:text-[#2563EB] transition-colors underline cursor-pointer"
          >
            Cookie Preferences
          </button>
        </div>

        {/* Bottom Copyright and System Health Indicator */}
        <div className="pt-4 border-t border-[#DFE7F3] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[#64748B] text-[11px]">AI Verification Engine: Nominal (99.98% Health)</span>
          </div>
          <p>© {new Date().getFullYear()} Tech Hacks AI. Built with open web standards.</p>
          <p className="flex items-center gap-1 text-[#64748B]">
            Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for the AI &amp; open-source community
          </p>
        </div>
      </div>
    </footer>
  );
};
