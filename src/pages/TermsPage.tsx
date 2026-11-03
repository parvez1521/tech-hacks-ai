import React from 'react';
import { Link } from '../router/Router';
import {
  FileText,
  ShieldCheck,
  Scale,
  AlertTriangle,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-slate-900 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Terms of Use</span>
      </nav>

      {/* Header */}
      <div className="mb-10 pb-8 border-b border-[#DFE7F3]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
          <Scale className="w-3.5 h-3.5" />
          <span>Platform Terms &amp; Conditions</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
          Terms of Use
        </h1>
        <p className="text-xs text-slate-500">
          Effective Date: October 30, 2026 • Last Reviewed: October 30, 2026
        </p>
      </div>

      <div className="space-y-10 text-sm leading-relaxed text-slate-600">
        {/* 1. Acceptance */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using <strong className="text-slate-900 font-semibold">{siteConfig.url}</strong> (the &quot;Site&quot; or &quot;SwitchRoute&quot;), you acknowledge that you have read, understood, and agree to be bound by these Terms of Use and our <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-medium underline">Privacy Policy</Link>. If you do not agree to these terms, please discontinue use of the Site.
          </p>
        </section>

        {/* 2. Nature of Service */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            2. Informational &amp; Educational Purpose
          </h2>
          <p>
            SwitchRoute is an independent discovery platform, software review directory, and technology publication. We provide software overviews, open-source alternatives, side-by-side comparison tables, prompt engineering templates, client-side developer utilities, and educational guides.
          </p>
          <p>
            All content published on the Site is provided strictly for educational, comparative, and informational purposes. While we strive for accuracy, information such as software pricing tiers, quota limits, API availability, and licensing is subject to change at the sole discretion of the respective third-party providers.
          </p>
        </section>

        {/* 3. Trademarks & Fair Use */}
        <section className="p-6 rounded-2xl border border-[#DFE7F3] bg-white space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h2>3. Third-Party Trademarks &amp; Nominative Fair Use</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            All company names, brand names, product logos, registered trademarks, and software names referenced on SwitchRoute (including but not limited to Figma, Notion, Firebase, Airtable, Postman, Google, Microsoft, OpenAI, Anthropic, and GitHub) are the property of their respective owners.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Reference to any specific third-party software, commercial process, or brand is made solely for descriptive, comparative, and identification purposes under nominative fair use principles. SwitchRoute is an independent platform and is not sponsored by, endorsed by, or affiliated with any third-party proprietary software providers unless explicitly disclosed.
          </p>
        </section>

        {/* 4. External Outbound Links */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            4. External Links &amp; Third-Party Repositories
          </h2>
          <p>
            The Site contains hyperlinks to external websites, documentation hubs, and code repositories (such as GitHub, GitLab, and official software portals). SwitchRoute has no control over the content, security, uptime, or privacy practices of external websites. Following outbound links is done at your own risk, and you should review the terms and policies of any third-party destination you visit.
          </p>
        </section>

        {/* 5. User Conduct & Acceptable Use */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            5. Acceptable Use Policy
          </h2>
          <p>
            When utilizing SwitchRoute and its free browser-based utilities, you agree not to:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs pl-2 text-slate-600">
            <li>Engage in automated denial-of-service (DoS) attacks or disrupt site infrastructure.</li>
            <li>Use automated scrapers or bots to harvest catalog records without prior written consent.</li>
            <li>Attempt to bypass client-side security controls or tamper with application scripts.</li>
            <li>Misrepresent SwitchRoute reviews or ratings as commercial product endorsements.</li>
          </ul>
        </section>

        {/* 6. Disclaimers & Limitation of Liability */}
        <section className="p-6 rounded-2xl border border-amber-200 bg-amber-50/70 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2>6. Disclaimer of Warranties &amp; Limitation of Liability</h2>
          </div>
          <p className="text-xs leading-relaxed text-slate-700">
            THE SITE AND ALL CONTENT, DIRECTORIES, GUIDES, AND UTILITIES ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED. SWITCHROUTE DISCLAIMS ALL WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
          <p className="text-xs leading-relaxed text-slate-700">
            IN NO EVENT SHALL SWITCHROUTE, ITS EDITORS, OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES RESULTING FROM YOUR USE OF OR INABILITY TO USE THE SITE, SOFTWARE RECOMMENDATIONS, SELF-HOSTING GUIDELINES, OR THIRD-PARTY API EXPENSES.
          </p>
        </section>

        {/* 7. Modifications & Inquiries */}
        <section className="pt-6 border-t border-[#DFE7F3] space-y-3">
          <h2 className="text-lg font-bold text-slate-900">
            7. Updates &amp; Legal Inquiries
          </h2>
          <p>
            We reserve the right to update or modify these Terms of Use at any time. Continued use of the Site after modifications constitutes acceptance of the revised terms.
          </p>
          <p className="text-xs text-slate-500">
            For general questions, review the available channel on our <Link to="/contact" className="text-blue-600 hover:text-blue-700 underline font-medium">Contact page</Link>. Instagram DMs are not a secure intake service or a formal method for serving legal notices. A dedicated legal contact channel is not configured yet.
          </p>
        </section>
      </div>
    </div>
  );
};
