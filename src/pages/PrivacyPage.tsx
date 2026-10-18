import React from 'react';
import { Link } from '../router/Router';
import {
  ShieldCheck,
  Lock,
  Cookie,
  ExternalLink,
  Globe,
  Sliders,
  Mail,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Privacy Policy</span>
      </nav>

      {/* Header */}
      <div className="mb-10 pb-8 border-b border-border/60">
        <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Data Protection & Privacy Notice</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight mb-4 leading-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-muted-foreground">
          Effective Date: October 18, 2026 • Last Reviewed: October 2026
        </p>
      </div>

      <div className="space-y-10 text-sm leading-relaxed text-secondary-foreground">
        {/* 1. Introduction */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            1. Introduction &amp; Overview
          </h2>
          <p>
            At Tech Hacks AI (accessible at <strong className="text-foreground">{siteConfig.url}</strong>), the privacy of our visitors is one of our core priorities. This Privacy Policy outlines the types of information collected and recorded by Tech Hacks AI and how we utilize it.
          </p>
          <p>
            If you have additional questions or require further information about our Privacy Policy, please contact our privacy desk at{' '}
            <a href="mailto:privacy@techhacksai.com" className="text-primary hover:underline font-mono">
              privacy@techhacksai.com
            </a>.
          </p>
        </section>

        {/* 2. Google Advertising Cookies & Third-Party Ad Networks */}
        <section className="p-6 rounded-2xl border border-primary/20 bg-primary/5 space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold text-base">
            <Cookie className="w-5 h-5" />
            <h2>2. Google Advertising Cookies &amp; Third-Party Ad Technology</h2>
          </div>
          <p>
            Google is a third-party vendor on our website. Google uses cookies, including the DoubleClick cookie and Google AdSense technologies, to serve advertisements to our site visitors based upon their visit to <strong className="text-foreground">techhacksai.com</strong> and other sites across the Internet.
          </p>
          <p>
            Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons in their respective advertisements and links that appear on Tech Hacks AI. When an advertisement is delivered to your browser, these vendors automatically receive your IP address. These technologies are used by third-party ad networks to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
          </p>
          <p className="text-xs text-muted-foreground">
            Please note: Tech Hacks AI does not have access to or control over cookies that are placed or utilized by third-party advertisers.
          </p>
        </section>

        {/* 3. Personalized Advertising Opt-Out Options */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground tracking-tight">
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
              className="p-3.5 rounded-xl border border-border bg-card/60 hover:bg-muted transition-colors flex items-center justify-between group"
            >
              <div>
                <strong className="text-foreground text-xs block group-hover:text-primary transition-colors">
                  Google Ads Settings
                </strong>
                <span className="text-[11px] text-muted-foreground">Manage your Google ad personalization</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary" />
            </a>

            <a
              href="https://optout.aboutads.info/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl border border-border bg-card/60 hover:bg-muted transition-colors flex items-center justify-between group"
            >
              <div>
                <strong className="text-foreground text-xs block group-hover:text-primary transition-colors">
                  Digital Advertising Alliance (DAA)
                </strong>
                <span className="text-[11px] text-muted-foreground">Consumer choice opt-out portal</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary" />
            </a>

            <a
              href="https://optout.networkadvertising.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl border border-border bg-card/60 hover:bg-muted transition-colors flex items-center justify-between group"
            >
              <div>
                <strong className="text-foreground text-xs block group-hover:text-primary transition-colors">
                  Network Advertising Initiative (NAI)
                </strong>
                <span className="text-[11px] text-muted-foreground">Multi-vendor opt-out mechanism</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary" />
            </a>

            <a
              href="https://www.youronlinechoices.eu/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl border border-border bg-card/60 hover:bg-muted transition-colors flex items-center justify-between group"
            >
              <div>
                <strong className="text-foreground text-xs block group-hover:text-primary transition-colors">
                  Your Online Choices (EDAA)
                </strong>
                <span className="text-[11px] text-muted-foreground">European interactive ad choices</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary" />
            </a>
          </div>
          <p className="text-xs text-muted-foreground pt-1">
            You can also choose to disable cookies through your individual browser options. Detailed information about cookie management with specific web browsers can be found at the browsers' respective websites.
          </p>
        </section>

        {/* 4. Log Files & Server Diagnostics */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            4. Log Files &amp; Automated Technical Data
          </h2>
          <p>
            Tech Hacks AI follows standard hosting server logging procedures. These logs capture internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and basic page interaction metrics. This technical information is not linked to any personally identifiable information and is utilized strictly for analyzing platform traffic, diagnosing errors, preventing malicious cyberattacks, and administering site reliability.
          </p>
        </section>

        {/* 5. Client-Side Storage & Local Preferences */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            5. Client-Side Storage &amp; Cookies We Set
          </h2>
          <p>
            To provide a responsive user experience without requiring user accounts or database profiling, Tech Hacks AI uses client-side web storage (HTML5 LocalStorage) for:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-secondary-foreground pl-2">
            <li>
              <strong>Theme Preference:</strong> Storing your preference for Dark Mode or Light Mode (<code className="text-primary font-mono text-[11px]">theme</code>).
            </li>
            <li>
              <strong>Saved Bookmarks:</strong> Persisting tools, guides, and prompt recipes you explicitly bookmark on the site (<code className="text-primary font-mono text-[11px]">saved_bookmarks</code>).
            </li>
            <li>
              <strong>Cookie Consent Settings:</strong> Recording your consent selections regarding optional analytics or advertising technologies (<code className="text-primary font-mono text-[11px]">cookie_consent</code>).
            </li>
          </ul>
          <p className="text-xs text-muted-foreground">
            This data remains entirely on your physical device. Tech Hacks AI does not transmit your saved bookmarks or UI preferences to external marketing databases.
          </p>
        </section>

        {/* 6. European Privacy Rights (GDPR / UK GDPR / Swiss DPA) & Google-Certified CMP */}
        <section className="p-6 rounded-2xl border border-border bg-card/70 space-y-4">
          <div className="flex items-center gap-2 text-foreground font-bold text-base">
            <Globe className="w-5 h-5 text-emerald-400" />
            <h2>6. European Economic Area (EEA), UK &amp; Swiss Visitors (GDPR Compliance)</h2>
          </div>
          <p>
            If you are located in the EEA, the United Kingdom, or Switzerland, you are entitled to specific rights under the General Data Protection Regulation (GDPR), the UK Data Protection Act, and the Swiss Federal Act on Data Protection (FADP):
          </p>
          <ul className="space-y-1.5 text-xs list-disc list-inside pl-2">
            <li><strong>Right to Access:</strong> You have the right to request copies of your personal data.</li>
            <li><strong>Right to Rectification:</strong> You have the right to request corrections to any information you believe is inaccurate.</li>
            <li><strong>Right to Erasure:</strong> You have the right to request the deletion of your personal data under certain conditions.</li>
            <li><strong>Right to Restrict Processing:</strong> You have the right to request that we restrict processing of your data.</li>
            <li><strong>Right to Object &amp; Data Portability:</strong> You have the right to object to processing and request data transfer.</li>
          </ul>
          <div className="p-4 rounded-xl bg-muted/60 border border-border text-xs space-y-2">
            <strong className="block text-foreground font-semibold">Google-Certified Consent Management Platform (CMP):</strong>
            <p>
              In compliance with Google's EU User Consent Policy and the IAB Europe Transparency and Consent Framework (TCF v2.2), visitors from the EEA, the UK, and Switzerland are presented with a Google-certified CMP consent dialog. Non-essential advertising cookies and personalized ad targeting are deactivated by default unless affirmative consent is granted. You can review or modify your consent settings at any time by selecting "Cookie Preferences" in our footer.
            </p>
          </div>
        </section>

        {/* 7. California Consumer Privacy Rights (CCPA / CPRA) */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            7. California Consumer Privacy Rights (CCPA / CPRA)
          </h2>
          <p>
            Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), California residents are entitled to specific privacy protections:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs pl-2">
            <li>The right to know what personal data categories a business collects.</li>
            <li>The right to request the deletion of personal data collected.</li>
            <li>The right to opt out of the sale or sharing of personal data.</li>
          </ul>
          <p className="text-xs">
            <strong className="text-foreground">Do Not Sell My Personal Information:</strong> Tech Hacks AI does not sell, rent, or trade your personal information to third-party data brokers.
          </p>
        </section>

        {/* 8. Children's Information (COPPA) */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            8. Children's Privacy (COPPA)
          </h2>
          <p>
            Protecting children while using the internet is paramount. Tech Hacks AI does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you believe that your child provided personal information on our website, please contact us immediately and we will promptly remove such information from our records.
          </p>
        </section>

        {/* 9. Contact Desk */}
        <section className="pt-6 border-t border-border space-y-3">
          <h2 className="text-lg font-bold text-foreground">
            9. Contacting Our Privacy Officer
          </h2>
          <p>
            For questions regarding this policy, cookie settings, or data protection rights, reach our designated privacy desk:
          </p>
          <p className="font-mono text-xs text-primary">
            Email: privacy@techhacksai.com
          </p>
          <p className="text-xs text-muted-foreground">
            Or submit a ticket directly through our <Link to="/contact" className="text-primary hover:underline">Contact Form</Link>.
          </p>
        </section>
      </div>
    </div>
  );
};
