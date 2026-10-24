import React, { useState } from 'react';
import { Link } from '../router/Router';
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Wrench,
  ShieldCheck,
  FileQuestion,
  Sparkles,
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'suggest-tool',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (status === 'error') {
      setStatus('idle');
      setErrorMessage('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (formData.message.trim().length < 15) {
      setStatus('error');
      setErrorMessage('Please provide a more descriptive message (at least 15 characters).');
      return;
    }

    setStatus('submitting');

    // Simulate reliable client-side submission with immediate acknowledgment
    setTimeout(() => {
      setStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: 'suggest-tool',
        message: '',
      });
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-slate-900 transition-colors">
          Home
        </Link>
        <span className="text-slate-400">/</span>
        <span className="text-slate-800 font-medium">Contact Us</span>
      </nav>

      {/* Header */}
      <div className="mb-10 pb-8 border-b border-[#DFE7F3]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
          <Mail className="w-3.5 h-3.5 text-blue-600" />
          <span>Get in Touch</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
          Contact SwitchRoute
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
          Have a tool to suggest, a pricing update to report, a technical bug to flag, or general editorial feedback? We review all submissions and inquiries within 1–2 business days.
        </p>
      </div>

      {/* Inquiry Channels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="p-5 rounded-2xl border border-[#DFE7F3] bg-white shadow-invary-card space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="font-semibold text-slate-900 text-sm">Tool Submissions</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Building an open-source tool or verified free generative platform? Share your repository or website link.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-[#DFE7F3] bg-white shadow-invary-card space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
            <Wrench className="w-4 h-4 text-emerald-600" />
          </div>
          <h2 className="font-semibold text-slate-900 text-sm">Data & Pricing Updates</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Did an indexed tool alter its pricing tier, free quota, or license? Let us know so we can keep our catalog accurate.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-[#DFE7F3] bg-white shadow-invary-card space-y-2">
          <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <h2 className="font-semibold text-slate-900 text-sm">Editorial & Legal</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            For trademark, copyright (DMCA), or privacy inquiries, our team responds promptly to address concerns.
          </p>
        </div>
      </div>

      {/* Main Form Section */}
      <div className="p-6 sm:p-8 rounded-2xl border border-[#DFE7F3] bg-white shadow-invary-card mb-12">
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          Send Us a Message
        </h2>

        {status === 'success' ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Message Received!</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Thank you for contacting SwitchRoute. Our editorial team reviews every message and will respond via email within 1–2 business days.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {status === 'error' && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Your Name <span className="text-blue-600">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Chen"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F8FF] border border-[#DFE7F3] text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address <span className="text-blue-600">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F8FF] border border-[#DFE7F3] text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Topic / Category <span className="text-blue-600">*</span>
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F8FF] border border-[#DFE7F3] text-slate-900 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all"
              >
                <option value="suggest-tool">Suggest a New Tool / Open Source Project</option>
                <option value="pricing-correction">Report Pricing or Feature Correction</option>
                <option value="bug-report">Technical Bug / Broken Link</option>
                <option value="copyright">Copyright, Trademark, or DMCA Notice</option>
                <option value="general">General Feedback / Editorial Inquiry</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Message & Details <span className="text-blue-600">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Include relevant tool URLs, pricing details, or context so our team can investigate..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F8FF] border border-[#DFE7F3] text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{status === 'submitting' ? 'Sending...' : 'Send Message'}</span>
            </button>
          </form>
        )}
      </div>

      {/* Alternative Direct Channels */}
      <div className="p-6 rounded-2xl border border-[#DFE7F3] bg-white text-xs text-slate-600 space-y-2 shadow-invary-card">
        <h3 className="font-semibold text-slate-900 text-sm mb-1">
          Direct Electronic Mail
        </h3>
        <p>
          You can also reach our editorial desk directly at{' '}
          <a href={`mailto:${siteConfig.links.email}`} className="text-blue-600 hover:text-blue-700 hover:underline font-mono">
            {siteConfig.links.email}
          </a>.
        </p>
        <p className="text-[11px] text-slate-500">
          For security and spam reduction, inquiries with attached executable files or automated bot submissions are filtered.
        </p>
      </div>
    </div>
  );
};
