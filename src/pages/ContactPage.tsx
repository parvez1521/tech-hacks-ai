import React from 'react';
import { Link } from '../router/Router';
import { AlertCircle, ArrowUpRight, Instagram, MessageCircle, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import { getConfiguredContactOptions } from '../config/contactConfig';

export const ContactPage: React.FC = () => {
  const instagramContact = getConfiguredContactOptions().find((option) => option.id === 'instagram');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
        <span className="text-slate-400">/</span>
        <span className="text-slate-800 font-medium">Contact Us</span>
      </nav>

      <div className="mb-10 pb-8 border-b border-[#DFE7F3]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
          <MessageCircle className="w-3.5 h-3.5 text-blue-600" />
          <span>Get in Touch</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
          Contact SwitchRoute
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
          For general, non-sensitive questions about the directory, you can message us on Instagram.
          A dedicated support inbox and secure contact-intake system are not configured yet.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl border border-[#DFE7F3] bg-white shadow-invary-card space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="font-semibold text-slate-900 text-sm">Tool Suggestions</h2>
          <p className="text-xs text-slate-600 leading-relaxed">For a quick, non-sensitive suggestion, message us on Instagram. Website submissions will be enabled once durable storage is ready.</p>
        </div>

        <div className="p-5 rounded-2xl border border-[#DFE7F3] bg-white shadow-invary-card space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
            <Wrench className="w-4 h-4 text-emerald-600" />
          </div>
          <h2 className="font-semibold text-slate-900 text-sm">Data &amp; Pricing Updates</h2>
          <p className="text-xs text-slate-600 leading-relaxed">Share a public tool URL and a short pricing correction through the general Instagram channel.</p>
        </div>

        <div className="p-5 rounded-2xl border border-[#DFE7F3] bg-white shadow-invary-card space-y-2">
          <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <h2 className="font-semibold text-slate-900 text-sm">Privacy &amp; Legal</h2>
          <p className="text-xs text-slate-600 leading-relaxed">A dedicated channel for sensitive privacy requests and formal legal notices is not available yet. Please do not send confidential details through social DMs.</p>
        </div>
      </div>

      {instagramContact && (
        <a
          href={instagramContact.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Message SwitchRoute on Instagram: ${instagramContact.display}`}
          className="mb-8 flex min-w-0 items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50/80 p-4 sm:p-5 shadow-invary-card transition-colors hover:border-blue-400 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-blue-200 bg-white text-blue-700">
            <Instagram className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-semibold uppercase tracking-wide text-blue-700">General enquiries</span>
            <span className="mt-0.5 block break-words text-sm sm:text-base font-bold text-slate-900">Message {instagramContact.display} on Instagram</span>
            <span className="mt-1 block text-xs leading-relaxed text-slate-600">For general questions only — don’t send passwords, confidential information, or formal privacy/legal requests.</span>
          </span>
          <ArrowUpRight className="h-5 w-5 shrink-0 text-blue-700" aria-hidden="true" />
        </a>
      )}

      <section
        className="p-6 sm:p-8 rounded-2xl border border-amber-200 bg-amber-50/80 shadow-invary-card"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">Contact submissions are temporarily unavailable through the website form</h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              No message can be sent or saved through a form on this page. Instagram DMs are external to SwitchRoute and are not stored in a SwitchRoute support ticket system.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dedicated support, privacy-request, and formal legal-notice channels still need to be configured. Please avoid sending sensitive or confidential information until those channels are available.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
