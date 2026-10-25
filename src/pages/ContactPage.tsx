import React from 'react';
import { Link } from '../router/Router';
import { AlertCircle, Mail, ShieldCheck, Sparkles, Wrench } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
        <span className="text-slate-400">/</span>
        <span className="text-slate-800 font-medium">Contact Us</span>
      </nav>

      <div className="mb-10 pb-8 border-b border-[#DFE7F3]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
          <Mail className="w-3.5 h-3.5 text-blue-600" />
          <span>Get in Touch</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
          Contact SwitchRoute
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
          Have feedback or a correction to share? Our contact channels are being configured.
          This page will be updated when messages can be received securely.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl border border-[#DFE7F3] bg-white shadow-invary-card space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="font-semibold text-slate-900 text-sm">Tool Submissions</h2>
          <p className="text-xs text-slate-600 leading-relaxed">A submission channel will be listed here when it can reliably receive and store suggestions.</p>
        </div>

        <div className="p-5 rounded-2xl border border-[#DFE7F3] bg-white shadow-invary-card space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
            <Wrench className="w-4 h-4 text-emerald-600" />
          </div>
          <h2 className="font-semibold text-slate-900 text-sm">Data &amp; Pricing Updates</h2>
          <p className="text-xs text-slate-600 leading-relaxed">Pricing and feature corrections cannot currently be submitted through this page.</p>
        </div>

        <div className="p-5 rounded-2xl border border-[#DFE7F3] bg-white shadow-invary-card space-y-2">
          <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <h2 className="font-semibold text-slate-900 text-sm">Editorial &amp; Legal</h2>
          <p className="text-xs text-slate-600 leading-relaxed">Legal, copyright, and privacy inquiries need a verified contact channel, which is not configured yet.</p>
        </div>
      </div>

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
            <h2 className="text-lg font-bold text-slate-900">Contact submissions are temporarily unavailable</h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              SwitchRoute does not currently have a verified support inbox or a connected message-storage service.
              No message can be sent or saved from this page, so the previous demo form has been removed rather than
              displaying a false confirmation.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Please do not send personal, confidential, or time-sensitive legal information here. A working contact
              method will be published once one has been configured.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
