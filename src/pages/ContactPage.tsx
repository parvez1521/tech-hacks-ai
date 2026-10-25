import React, { useEffect, useState } from 'react';
import { Link } from '../router/Router';
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Instagram,
  Loader2,
  Mail,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { getConfiguredContactOptions } from '../config/contactConfig';

type IntakeState = 'checking' | 'ready' | 'unavailable';
type FormState = 'idle' | 'submitting' | 'success' | 'error';

const emptyForm = {
  name: '',
  email: '',
  subject: 'general',
  message: '',
  website_hp: '',
};

export const ContactPage: React.FC = () => {
  const contactOptions = getConfiguredContactOptions();
  const instagramContact = contactOptions.find((option) => option.id === 'instagram');
  const emailContact = contactOptions.find((option) => option.id === 'email');
  const [intakeState, setIntakeState] = useState<IntakeState>('checking');
  const [formState, setFormState] = useState<FormState>('idle');
  const [formData, setFormData] = useState(emptyForm);
  const [formMessage, setFormMessage] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/contact?action=status', { method: 'GET', cache: 'no-store', signal: controller.signal })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        setIntakeState(response.ok && data.configured === true ? 'ready' : 'unavailable');
      })
      .catch(() => {
        if (!controller.signal.aborted) setIntakeState('unavailable');
      });
    return () => controller.abort();
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((previous) => ({ ...previous, [event.target.name]: event.target.value }));
    if (formState === 'error') {
      setFormState('idle');
      setFormMessage('');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formState === 'submitting' || intakeState !== 'ready') return;

    setFormState('submitting');
    setFormMessage('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success !== true) {
        setFormState('error');
        setFormMessage(
          typeof result.message === 'string'
            ? result.message
            : 'Your message was not saved. Please try again or use Instagram for non-sensitive general questions.'
        );
        if (response.status === 503) setIntakeState('unavailable');
        return;
      }

      setFormData(emptyForm);
      setFormState('success');
      setFormMessage('Your message was received and saved to the SwitchRoute contact inbox.');
    } catch {
      setFormState('error');
      setFormMessage('The request could not reach the server, so your message was not saved. Please try again later.');
    }
  };

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
          Send a directory suggestion, report a pricing correction, or share general feedback.
          For support, privacy, copyright, or security enquiries, email us directly. Website-form messages are only confirmed after the server saves them successfully.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl border border-[#DFE7F3] bg-white shadow-invary-card space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="font-semibold text-slate-900 text-sm">Tool Suggestions</h2>
          <p className="text-xs text-slate-600 leading-relaxed">Share the tool name, official website, and what should be added or corrected.</p>
        </div>

        <div className="p-5 rounded-2xl border border-[#DFE7F3] bg-white shadow-invary-card space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
            <Wrench className="w-4 h-4 text-emerald-600" />
          </div>
          <h2 className="font-semibold text-slate-900 text-sm">Data &amp; Pricing Updates</h2>
          <p className="text-xs text-slate-600 leading-relaxed">Point us to a public page that confirms a changed price, feature, limit, or license.</p>
        </div>

        <div className="p-5 rounded-2xl border border-[#DFE7F3] bg-white shadow-invary-card space-y-2">
          <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <h2 className="font-semibold text-slate-900 text-sm">Privacy &amp; Legal</h2>
          <p className="text-xs text-slate-600 leading-relaxed">Do not include passwords, payment details, or highly sensitive information. Formal legal notices may require a verified direct contact channel.</p>
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
            <span className="mt-1 block text-xs leading-relaxed text-slate-600">For general, non-sensitive questions only. DMs are not saved in the SwitchRoute contact inbox.</span>
          </span>
          <ArrowUpRight className="h-5 w-5 shrink-0 text-blue-700" aria-hidden="true" />
        </a>
      )}

      {emailContact && (
        <a
          href={emailContact.href}
          aria-label={`Email SwitchRoute: ${emailContact.display}`}
          className="mb-8 flex min-w-0 items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 sm:p-5 shadow-invary-card transition-colors hover:border-emerald-400 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-emerald-200 bg-white text-emerald-700">
            <Mail className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-semibold uppercase tracking-wide text-emerald-700">Official support email</span>
            <span className="mt-0.5 block break-words text-sm sm:text-base font-bold text-slate-900">{emailContact.display}</span>
            <span className="mt-1 block text-xs leading-relaxed text-slate-600">For enquiries, factual corrections, privacy requests, copyright notices, and security reports.</span>
          </span>
          <ArrowUpRight className="h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
        </a>
      )}

      <section className="rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-invary-card" aria-labelledby="contact-form-heading">
        <div className="mb-5">
          <h2 id="contact-form-heading" className="text-xl font-bold text-foreground">Send a message</h2>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Messages are stored in the private admin inbox when contact intake is configured.
          </p>
        </div>

        {intakeState === 'checking' && (
          <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground" role="status">
            <Loader2 className="h-4 w-4 animate-spin" />
            Checking secure message intake…
          </div>
        )}

        {intakeState === 'unavailable' && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950" role="status" aria-live="polite">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <h3 className="text-sm font-bold">Website contact form is not active yet</h3>
              <p className="mt-1 text-xs leading-relaxed">
                Secure message storage is not configured or reachable, so this page will not collect or pretend to send a message.
                Please email <a className="font-semibold underline underline-offset-2" href={emailContact?.href || 'mailto:support@switchroute.in'}>{emailContact?.display || 'support@switchroute.in'}</a> for support and formal requests. Instagram is available for general, non-sensitive questions only.
              </p>
            </div>
          </div>
        )}

        {intakeState === 'ready' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {formState === 'success' && (
              <div className="flex items-start gap-2 rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-emerald-900" role="status" aria-live="polite">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <p className="text-sm">{formMessage}</p>
              </div>
            )}
            {formState === 'error' && (
              <div className="flex items-start gap-2 rounded-xl border border-rose-300 bg-rose-50 p-3 text-rose-900" role="alert">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p className="text-sm">{formMessage}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="min-w-0">
                <label htmlFor="contact-name" className="mb-1.5 block text-xs font-semibold text-foreground">Name</label>
                <input
                  id="contact-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  minLength={2}
                  maxLength={80}
                  autoComplete="name"
                  className="w-full min-w-0 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="Your name"
                />
              </div>
              <div className="min-w-0">
                <label htmlFor="contact-email" className="mb-1.5 block text-xs font-semibold text-foreground">Reply email</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  maxLength={254}
                  autoComplete="email"
                  className="w-full min-w-0 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-subject" className="mb-1.5 block text-xs font-semibold text-foreground">Topic</label>
              <select
                id="contact-subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="general">General feedback</option>
                <option value="tool-suggestion">Suggest a tool</option>
                <option value="pricing-correction">Pricing or feature correction</option>
                <option value="bug-report">Technical bug or broken link</option>
                <option value="copyright">Copyright or trademark inquiry</option>
                <option value="privacy">Privacy request</option>
                <option value="security">Security concern</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="contact-message" className="mb-1.5 block text-xs font-semibold text-foreground">Message</label>
              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                minLength={15}
                maxLength={5000}
                rows={6}
                className="w-full resize-y rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="Share the details and any public source URL that helps us verify your message…"
              />
              <p className="mt-1 text-right text-[11px] text-muted-foreground">{formData.message.length}/5000</p>
            </div>

            <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="contact-website-hp">Leave this field blank</label>
              <input
                id="contact-website-hp"
                tabIndex={-1}
                autoComplete="off"
                name="website_hp"
                value={formData.website_hp}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-relaxed text-muted-foreground">
                Do not submit passwords, payment details, or highly sensitive personal data. No email notification is sent; check the admin inbox for new messages.
              </p>
              <button
                type="submit"
                disabled={formState === 'submitting'}
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {formState === 'submitting' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                {formState === 'submitting' ? 'Sending…' : 'Send message'}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
};
