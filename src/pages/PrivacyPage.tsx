import React from 'react';
import { Link } from '../router/Router';
import {
  ShieldCheck,
  Lock,
  Cookie,
  ExternalLink,
  Globe,
  Sliders,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-slate-900 transition-colors">
          Home
        </Link>
        <span className="text-slate-400">/</span>
        <span className="text-slate-800 font-medium">Privacy Policy</span>
      </nav>

      {/* Header */}
      <div className="mb-10 pb-8 border-b border-[#DFE7F3]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Data Protection & Privacy Notice</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500">
          Effective Date: October 18, 2026 • Last Reviewed: October 2026
        </p>
      </div>

      <div className="space-y-10 text-sm leading-relaxed text-slate-600">
        {/* 1. Introduction */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            1. Introduction &amp; Overview
          </h2>
          <p>
            At SwitchRoute (accessible at <strong className="text-slate-900">{siteConfig.url}</strong>), the privacy of our visitors is one of our core priorities. This Privacy Policy outlines the types of information collected and recorded by SwitchRoute and how we utilize it.
          </p>
          <p>
            For support, content corrections, privacy and data-rights requests, copyright notices, or security concerns, email <a href={`mailto:${siteConfig.links.email}`} className="text-blue-600 hover:text-blue-700 underline">{siteConfig.links.email}</a> or visit our <Link to="/contact" className="text-blue-600 hover:text-blue-700 underline">Contact page</Link>. Include the relevant URL and enough detail for us to understand the request; never email passwords or payment credentials.
          </p>
        </section>

        {/* 2. Google Advertising Cookies & Third-Party Ad Networks */}
        <section className="p-6 rounded-2xl border border-blue-200 bg-blue-50/70 space-y-4">
          <div className="flex items-center gap-2 text-blue-700 font-bold text-base">
            <Cookie className="w-5 h-5 text-blue-600" />
            <h2>2. Google Advertising Cookies &amp; Third-Party Ad Technology</h2>
          </div>
          <p>
            SwitchRoute is not currently serving Google AdSense advertisements. If advertising is approved and enabled in the future, Google may use cookies, including the DoubleClick cookie, and similar technologies to serve and measure ads, help prevent fraud, limit repeated ads, and—where permitted by your choices and applicable law—personalize advertising.
          </p>
          <p>
            Advertising partners may process technical information such as an IP address, browser/device details, and ad interaction information when ads are requested. The exact data use depends on the providers and settings in effect at the time ads are enabled. We will update this policy when advertising technology is activated.
          </p>
          <p className="text-xs text-slate-500">
            We will not enable personalized advertising for visitors in the EEA, United Kingdom, or Switzerland until the required Google-certified consent management setup is configured. See <a href="https://support.google.com/adsense/answer/13554116?hl=en" target="_blank" rel="noopener noreferrer" className="underline">Google's publisher consent guidance</a>.
          </p>
        </section>

        {/* 3. Personalized Advertising Opt-Out Options */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            3. How to Opt Out of Personalized Advertising
          </h2>
          <p>
            Visitors have full control over advertising cookies and may opt out of personalized advertising at any time through official industry mechanisms:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <a
              href="https://adssettings.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl border border-[#DFE7F3] bg-white hover:bg-slate-50 hover:border-blue-300 transition-colors flex items-center justify-between group shadow-invary-card"
            >
              <div>
                <strong className="text-slate-900 text-xs block group-hover:text-blue-600 transition-colors">
                  Google Ads Settings
                </strong>
                <span className="text-[11px] text-slate-500">Manage your Google ad personalization</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
            </a>

            <a
              href="https://optout.aboutads.info/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl border border-[#DFE7F3] bg-white hover:bg-slate-50 hover:border-blue-300 transition-colors flex items-center justify-between group shadow-invary-card"
            >
              <div>
                <strong className="text-slate-900 text-xs block group-hover:text-blue-600 transition-colors">
                  Digital Advertising Alliance (DAA)
                </strong>
                <span className="text-[11px] text-slate-500">Consumer choice opt-out portal</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
            </a>

            <a
              href="https://optout.networkadvertising.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl border border-[#DFE7F3] bg-white hover:bg-slate-50 hover:border-blue-300 transition-colors flex items-center justify-between group shadow-invary-card"
            >
              <div>
                <strong className="text-slate-900 text-xs block group-hover:text-blue-600 transition-colors">
                  Network Advertising Initiative (NAI)
                </strong>
                <span className="text-[11px] text-slate-500">Multi-vendor opt-out mechanism</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
            </a>

            <a
              href="https://www.youronlinechoices.eu/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl border border-[#DFE7F3] bg-white hover:bg-slate-50 hover:border-blue-300 transition-colors flex items-center justify-between group shadow-invary-card"
            >
              <div>
                <strong className="text-slate-900 text-xs block group-hover:text-blue-600 transition-colors">
                  Your Online Choices (EDAA)
                </strong>
                <span className="text-[11px] text-slate-500">European interactive ad choices</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
            </a>
          </div>
          <p className="text-xs text-slate-500 pt-1">
            You can also choose to disable cookies through your individual browser options. Detailed information about cookie management with specific web browsers can be found at the browsers' respective websites.
          </p>
        </section>

        {/* 4. Log Files & Server Diagnostics */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            4. Log Files &amp; Automated Technical Data
          </h2>
          <p>
            SwitchRoute follows standard hosting server logging procedures. These logs capture internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and basic page interaction metrics. We use the technical information for traffic analysis, error diagnosis, abuse prevention, and site reliability. Hosting providers may process request metadata as part of delivering and protecting the service.
          </p>
        </section>

        {/* 5. Contact Form Messages (only when secure intake is configured) */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            5. Contact Form Messages (When Available)
          </h2>
          <p>
            When the contact page reports that secure intake is available, the name, reply email address, selected topic,
            message, and message timestamps are sent to SwitchRoute's server and stored in a private contact-inbox table.
            These details are used to review, respond to, and manage the inquiry, including identifying spam.
          </p>
          <p>
            The contact inbox is not publicly queryable. Access is restricted to trusted server-side code and the
            authenticated moderation dashboard. Contact messages are not used for advertising or sold to third parties.
            No automatic email notification is configured, so new messages must be checked in the admin inbox.
          </p>
          <p className="text-xs text-slate-500">
            Messages can be marked resolved and manually deleted by an administrator. Automated deletion by age is not
            currently configured. Please do not submit passwords, payment details, or highly sensitive personal data.
            If contact intake is not configured or reachable, the website form remains disabled and does not save a message.
          </p>
        </section>

        {/* 6. Client-Side Storage & Local Preferences */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            6. Client-Side Storage &amp; Cookies We Set
          </h2>
          <p>
            To provide a responsive user experience without requiring user accounts or database profiling, SwitchRoute uses client-side web storage (HTML5 LocalStorage) for:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600 pl-2">
            <li>
              <strong className="text-slate-900">Theme Preference:</strong> Storing your preference for Dark Mode or Light Mode (<code className="text-blue-700 font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded border border-slate-200">theme</code>).
            </li>
            <li>
              <strong className="text-slate-900">Saved Bookmarks:</strong> Persisting tools, guides, and prompt recipes you explicitly bookmark on the site (<code className="text-blue-700 font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded border border-slate-200">saved_bookmarks</code>).
            </li>
            <li>
              <strong className="text-slate-900">Cookie Consent Settings:</strong> Recording your consent selections regarding optional analytics or advertising technologies (<code className="text-blue-700 font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded border border-slate-200">cookie_consent</code>).
            </li>
          </ul>
          <p className="text-xs text-slate-500">
            This data remains entirely on your physical device. SwitchRoute does not transmit your saved bookmarks or UI preferences to external marketing databases.
          </p>
        </section>

        {/* 7. European Privacy Rights (GDPR / UK GDPR / Swiss DPA) & Google-Certified CMP */}
        <section className="p-6 rounded-2xl border border-[#DFE7F3] bg-white shadow-invary-card space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Globe className="w-5 h-5 text-emerald-600" />
            <h2>7. European Economic Area (EEA), UK &amp; Swiss Visitors (GDPR Compliance)</h2>
          </div>
          <p>
            If you are located in the EEA, the United Kingdom, or Switzerland, you are entitled to specific rights under the General Data Protection Regulation (GDPR), the UK Data Protection Act, and the Swiss Federal Act on Data Protection (FADP):
          </p>
          <ul className="space-y-1.5 text-xs list-disc list-inside pl-2 text-slate-600">
            <li><strong className="text-slate-900">Right to Access:</strong> You have the right to request copies of your personal data.</li>
            <li><strong className="text-slate-900">Right to Rectification:</strong> You have the right to request corrections to any information you believe is inaccurate.</li>
            <li><strong className="text-slate-900">Right to Erasure:</strong> You have the right to request the deletion of your personal data under certain conditions.</li>
            <li><strong className="text-slate-900">Right to Restrict Processing:</strong> You have the right to request that we restrict processing of your data.</li>
            <li><strong className="text-slate-900">Right to Object &amp; Data Portability:</strong> You have the right to object to processing and request data transfer.</li>
          </ul>
          <div className="p-4 rounded-xl bg-[#F5F8FF] border border-[#DFE7F3] text-xs space-y-2">
            <strong className="block text-slate-900 font-semibold">Google-Certified Consent Management Platform (CMP):</strong>
            <p className="text-slate-600">
              Current status: SwitchRoute's on-site Cookie Preferences panel stores browser-level choices; it is not itself a Google-certified CMP and does not transmit IAB TCF consent signals. Google requires publishers serving personalized ads in the EEA, UK, or Switzerland to use a certified CMP integrated with the TCF. We will configure the required consent flow before enabling ads for those visitors and update this notice when that setup is live.
            </p>
          </div>
        </section>

        {/* 7. California Consumer Privacy Rights (CCPA / CPRA) */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            8. California Consumer Privacy Rights (CCPA / CPRA)
          </h2>
          <p>
            Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), California residents are entitled to specific privacy protections:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs pl-2 text-slate-600">
            <li>The right to know what personal data categories a business collects.</li>
            <li>The right to request the deletion of personal data collected.</li>
            <li>The right to opt out of the sale or sharing of personal data.</li>
          </ul>
          <p className="text-xs">
            <strong className="text-slate-900">Do Not Sell My Personal Information:</strong> SwitchRoute does not sell, rent, or trade your personal information to third-party data brokers.
          </p>
        </section>

        {/* 9. Children's Information (COPPA) */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            9. Children's Privacy (COPPA)
          </h2>
          <p>
            Protecting children while using the internet is paramount. SwitchRoute does not knowingly collect personal information from children under the age of 13. To report information that may need to be removed, contact <a href={`mailto:${siteConfig.links.email}`} className="underline">{siteConfig.links.email}</a>. Please provide only the minimum information needed to identify the issue; do not send passwords or payment credentials.
          </p>
        </section>

        {/* 10. Contact Desk */}
        <section className="pt-6 border-t border-[#DFE7F3] space-y-3">
          <h2 className="text-lg font-bold text-slate-900">
            10. Contacting Our Privacy Officer
          </h2>
          <p>
            For privacy questions, data-rights requests, or policy concerns, email <a href={`mailto:${siteConfig.links.email}`} className="text-blue-600 hover:text-blue-700 underline">{siteConfig.links.email}</a> or use our <Link to="/contact" className="text-blue-600 hover:text-blue-700 underline">Contact page</Link>. Requests are handled by email; please include enough detail to locate the relevant information and avoid sending passwords or payment credentials.
          </p>
        </section>
      </div>
    </div>
  );
};
