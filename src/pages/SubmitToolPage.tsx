import React, { useState, useEffect } from 'react';
import { Link } from '../router/Router';
import { submitTool, checkClientToolDuplicate } from '../services/submissionService';
import type { ToolSubmissionData } from '../types/submissions';
import { aiCategories } from '../data/aiToolsData';
import {
  Sparkles,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Info,
  Globe,
  Tag,
  DollarSign,
  Laptop,
  Mail,
  User,
  Layers,
  HelpCircle,
  ShieldCheck,
  Send,
  Loader2,
} from 'lucide-react';

const PLATFORM_OPTIONS = ['Web', 'macOS', 'Windows', 'Linux', 'iOS', 'Android', 'API'];

export const SubmitToolPage: React.FC = () => {
  const [formData, setFormData] = useState<ToolSubmissionData>({
    name: '',
    websiteUrl: '',
    description: '',
    category: '',
    pricingType: 'freemium',
    logoUrl: '',
    features: [],
    platform: ['Web'],
    alternativeTo: '',
    submitterName: '',
    submitterEmail: '',
    notes: '',
  });

  const [featuresInput, setFeaturesInput] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{ id: string; duplicateWarning?: boolean; reason?: string } | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Client duplicate warning
  const [duplicateNotice, setDuplicateNotice] = useState<{ isDuplicate: boolean; reason?: string; matchSlug?: string }>({
    isDuplicate: false,
  });

  // Check duplicate when name or websiteUrl changes
  useEffect(() => {
    if (formData.name.trim().length >= 3 || formData.websiteUrl.trim().length >= 5) {
      const result = checkClientToolDuplicate(formData.name, formData.websiteUrl);
      setDuplicateNotice(result);
    } else {
      setDuplicateNotice({ isDuplicate: false });
    }
  }, [formData.name, formData.websiteUrl]);

  const handleInputChange = (field: keyof ToolSubmissionData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear specific field error
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handlePlatformToggle = (plat: string) => {
    setFormData((prev) => {
      const current = prev.platform || [];
      if (current.includes(plat)) {
        return { ...prev, platform: current.filter((p) => p !== plat) };
      } else {
        return { ...prev, platform: [...current, plat] };
      }
    });
  };

  const handleFeaturesChange = (text: string) => {
    setFeaturesInput(text);
    const parsed = text
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, features: parsed }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tool name is required.';
    } else if (formData.name.trim().length < 2 || formData.name.trim().length > 80) {
      newErrors.name = 'Tool name must be between 2 and 80 characters.';
    }

    if (!formData.websiteUrl.trim()) {
      newErrors.websiteUrl = 'Official website URL is required.';
    } else if (!/^https?:\/\/.+\..+/i.test(formData.websiteUrl.trim())) {
      newErrors.websiteUrl = 'Please enter a valid website address starting with http:// or https://';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required.';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Please provide at least 20 characters explaining what the tool does.';
    } else if (formData.description.trim().length > 500) {
      newErrors.description = 'Description must not exceed 500 characters.';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a primary category.';
    }

    if (formData.submitterEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.submitterEmail.trim())) {
      newErrors.submitterEmail = 'Please provide a valid email address.';
    }

    if (formData.logoUrl && !/^https?:\/\/.+\..+/i.test(formData.logoUrl.trim())) {
      newErrors.logoUrl = 'Logo URL must be a valid http:// or https:// address.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await submitTool(formData, honeypot);
      if (response.success && response.id) {
        setSubmissionSuccess({
          id: response.id,
          duplicateWarning: response.potentialDuplicate,
          reason: response.duplicateReason,
        });
      } else {
        if (response.errors) {
          setErrors(response.errors);
        }
        setGeneralError(response.message || 'Submission could not be saved. Please try again.');
      }
    } catch (err: any) {
      setGeneralError(err?.message || 'A network error occurred. Your entered information has been preserved.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      websiteUrl: '',
      description: '',
      category: '',
      pricingType: 'freemium',
      logoUrl: '',
      features: [],
      platform: ['Web'],
      alternativeTo: '',
      submitterName: '',
      submitterEmail: '',
      notes: '',
    });
    setFeaturesInput('');
    setSubmissionSuccess(null);
    setErrors({});
    setGeneralError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Navigation Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link to="/ai-tools" className="hover:text-foreground">AI Tools</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Submit a Tool</span>
      </nav>

      {/* Header Banner */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
          <UploadCloud className="w-4 h-4" />
          <span>Community Directory Contributions</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">
          Submit an AI Tool or Alternative
        </h1>
        <p className="text-sm sm:text-base text-secondary-foreground max-w-2xl leading-relaxed">
          Help independent developers, creators, and teams discover high-quality software. Submissions are reviewed by the Tech Hacks AI editorial team to verify accurate pricing, legitimate websites, and quality standards before being cataloged.
        </p>
      </div>

      {/* Success Confirmation View */}
      {submissionSuccess ? (
        <div className="p-8 rounded-2xl border border-emerald-500/30 bg-card/90 shadow-xl text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-2">Submission Successfully Received!</h2>
          <p className="text-sm text-secondary-foreground max-w-lg mx-auto mb-4 leading-relaxed">
            Thanks for contributing to Tech Hacks AI! Your submission for <strong className="text-foreground">{formData.name}</strong> has been saved with reference ID:
          </p>

          <div className="inline-block px-4 py-1.5 rounded-lg bg-muted font-mono text-xs text-primary font-bold border border-border mb-6">
            {submissionSuccess.id}
          </div>

          {submissionSuccess.duplicateWarning && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs text-left max-w-md mx-auto mb-6">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <strong className="block font-semibold mb-0.5">Note on Duplicate Check:</strong>
                  <span>{submissionSuccess.reason} Our editorial team will review whether this constitutes a major update or separate product edition.</span>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 rounded-xl bg-card border border-border text-xs text-muted-foreground max-w-md mx-auto mb-8 text-left space-y-1.5">
            <div className="font-semibold text-foreground flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>What happens next?</span>
            </div>
            <p>1. Editors test the website, verify HTTPS security, and inspect the pricing tier.</p>
            <p>2. Authentic brand logos and vector marks are assigned from official sources.</p>
            <p>3. Upon approval, your tool goes live in the public directory and comparison tables.</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleResetForm}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-sm transition-all"
            >
              Submit Another Tool
            </button>
            <Link
              to="/ai-tools"
              className="px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-medium text-sm transition-all"
            >
              Browse AI Tools Directory
            </Link>
          </div>
        </div>
      ) : (
        /* Form View */
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          {/* Honeypot field for bot suppression */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website_hp">Leave this field blank</label>
            <input
              type="text"
              id="website_hp"
              name="website_hp"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {generalError && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Submission Error</strong>
                <span>{generalError}</span>
              </div>
            </div>
          )}

          {/* Duplicate warning notification */}
          {duplicateNotice.isDuplicate && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold text-amber-300 mb-0.5">Potential Existing Catalog Entry</strong>
                <p className="leading-relaxed">
                  {duplicateNotice.reason} If your submission represents a newly launched feature, v2 upgrade, or distinct open-source edition, feel free to proceed and specify this in the notes below.
                </p>
              </div>
            </div>
          )}

          {/* Section 1: Core Tool Information */}
          <div className="p-6 sm:p-7 rounded-2xl border border-border bg-card/80 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-border/60">
              <Globe className="w-4 h-4 text-primary" />
              <h2 className="text-base font-bold text-foreground">1. Core Tool Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Tool Name */}
              <div>
                <label htmlFor="tool-name" className="block text-xs font-semibold text-foreground mb-1.5">
                  Tool Name <span className="text-rose-400">*</span>
                </label>
                <input
                  id="tool-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g. Cursor, Higgsfield AI, Postiz"
                  className={`w-full px-3.5 py-2.5 rounded-lg bg-card border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 ${
                    errors.name ? 'border-rose-500 focus:ring-rose-500/50' : 'border-border focus:ring-primary/50'
                  }`}
                />
                {errors.name ? (
                  <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.name}</p>
                ) : (
                  <p className="text-[11px] text-muted-foreground mt-1">Official brand or product title</p>
                )}
              </div>

              {/* Official Website URL */}
              <div>
                <label htmlFor="website-url" className="block text-xs font-semibold text-foreground mb-1.5">
                  Official Website URL <span className="text-rose-400">*</span>
                </label>
                <input
                  id="website-url"
                  type="url"
                  required
                  value={formData.websiteUrl}
                  onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                  placeholder="https://example.com"
                  className={`w-full px-3.5 py-2.5 rounded-lg bg-card border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 ${
                    errors.websiteUrl ? 'border-rose-500 focus:ring-rose-500/50' : 'border-border focus:ring-primary/50'
                  }`}
                />
                {errors.websiteUrl ? (
                  <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.websiteUrl}</p>
                ) : (
                  <p className="text-[11px] text-muted-foreground mt-1">Primary landing page or official project repository</p>
                )}
              </div>
            </div>

            {/* Short Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="tool-description" className="block text-xs font-semibold text-foreground">
                  Short Description <span className="text-rose-400">*</span>
                </label>
                <span className="text-[11px] text-muted-foreground">
                  {formData.description.length}/500 chars
                </span>
              </div>
              <textarea
                id="tool-description"
                required
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Explain what the tool does, who it is for, and its primary technical capabilities (20 to 500 characters)..."
                className={`w-full px-3.5 py-2.5 rounded-lg bg-card border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 leading-relaxed ${
                  errors.description ? 'border-rose-500 focus:ring-rose-500/50' : 'border-border focus:ring-primary/50'
                }`}
              />
              {errors.description && (
                <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Section 2: Category & Pricing Model */}
          <div className="p-6 sm:p-7 rounded-2xl border border-border bg-card/80 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-border/60">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base font-bold text-foreground">2. Classification &amp; Pricing Tier</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Category */}
              <div>
                <label htmlFor="tool-category" className="block text-xs font-semibold text-foreground mb-1.5">
                  Primary Category <span className="text-rose-400">*</span>
                </label>
                <select
                  id="tool-category"
                  required
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-lg bg-card border text-foreground text-sm focus:outline-none focus:ring-2 ${
                    errors.category ? 'border-rose-500 focus:ring-rose-500/50' : 'border-border focus:ring-primary/50'
                  }`}
                >
                  <option value="">Select a category...</option>
                  {aiCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.id})
                    </option>
                  ))}
                  <option value="developer-tools">Developer Tools &amp; Infrastructure</option>
                  <option value="database-backend">Database &amp; BaaS</option>
                  <option value="security">Privacy &amp; Security</option>
                </select>
                {errors.category && (
                  <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.category}</p>
                )}
              </div>

              {/* Pricing Type */}
              <div>
                <label htmlFor="pricing-type" className="block text-xs font-semibold text-foreground mb-1.5">
                  Pricing Model <span className="text-rose-400">*</span>
                </label>
                <select
                  id="pricing-type"
                  required
                  value={formData.pricingType}
                  onChange={(e) => handleInputChange('pricingType', e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="free">100% Free / Zero Cost</option>
                  <option value="freemium">Freemium (Free tier + paid upgrades)</option>
                  <option value="open-source">Open Source Software (Self-Hostable)</option>
                  <option value="paid">Paid Only / Commercial License</option>
                </select>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Pricing claims will be verified against official pricing documentation.
                </p>
              </div>
            </div>

            {/* Platform checkboxes */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-2">
                Supported Platforms &amp; Execution Environments
              </label>
              <div className="flex flex-wrap gap-2">
                {PLATFORM_OPTIONS.map((plat) => {
                  const isChecked = (formData.platform || []).includes(plat);
                  return (
                    <button
                      type="button"
                      key={plat}
                      onClick={() => handlePlatformToggle(plat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        isChecked
                          ? 'bg-primary/10 border-primary text-primary font-semibold'
                          : 'bg-card border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {plat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 3: Feature Highlights & Competitive Positioning */}
          <div className="p-6 sm:p-7 rounded-2xl border border-border bg-card/80 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-border/60">
              <Layers className="w-4 h-4 text-purple-400" />
              <h2 className="text-base font-bold text-foreground">3. Features &amp; Open Alternative Context</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Alternative To */}
              <div>
                <label htmlFor="alternative-to" className="block text-xs font-semibold text-foreground mb-1.5">
                  Alternative / Replacement To (Optional)
                </label>
                <input
                  id="alternative-to"
                  type="text"
                  value={formData.alternativeTo || ''}
                  onChange={(e) => handleInputChange('alternativeTo', e.target.value)}
                  placeholder="e.g. ChatGPT, Notion, Midjourney, Figma"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  If this tool replaces proprietary software, specify which one.
                </p>
              </div>

              {/* Logo / Asset URL */}
              <div>
                <label htmlFor="logo-url" className="block text-xs font-semibold text-foreground mb-1.5">
                  Official Logo URL (Optional)
                </label>
                <input
                  id="logo-url"
                  type="url"
                  value={formData.logoUrl || ''}
                  onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                  placeholder="https://example.com/logo.svg"
                  className={`w-full px-3.5 py-2.5 rounded-lg bg-card border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 ${
                    errors.logoUrl ? 'border-rose-500 focus:ring-rose-500/50' : 'border-border focus:ring-primary/50'
                  }`}
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Official SVG or transparent PNG link. All brand marks are audited before display.
                </p>
              </div>
            </div>

            {/* Feature Highlights */}
            <div>
              <label htmlFor="features-input" className="block text-xs font-semibold text-foreground mb-1.5">
                Key Features (Comma-separated)
              </label>
              <input
                id="features-input"
                type="text"
                value={featuresInput}
                onChange={(e) => handleFeaturesChange(e.target.value)}
                placeholder="e.g. Local GGUF models, API access, Unlimited generations, Privacy-first"
                className="w-full px-3.5 py-2.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Enter 3–5 distinctive features separated by commas.
              </p>
            </div>
          </div>

          {/* Section 4: Submitter Attribution & Notes */}
          <div className="p-6 sm:p-7 rounded-2xl border border-border bg-card/80 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-border/60">
              <User className="w-4 h-4 text-amber-400" />
              <h2 className="text-base font-bold text-foreground">4. Attribution &amp; Editorial Notes</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Submitter Name */}
              <div>
                <label htmlFor="submitter-name" className="block text-xs font-semibold text-foreground mb-1.5">
                  Your Name / Handle (Optional)
                </label>
                <input
                  id="submitter-name"
                  type="text"
                  value={formData.submitterName || ''}
                  onChange={(e) => handleInputChange('submitterName', e.target.value)}
                  placeholder="e.g. Rahul Verma or @rahul_ai"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Credit as community contributor
                </p>
              </div>

              {/* Submitter Email */}
              <div>
                <label htmlFor="submitter-email" className="block text-xs font-semibold text-foreground mb-1.5">
                  Contact Email (Optional)
                </label>
                <input
                  id="submitter-email"
                  type="email"
                  value={formData.submitterEmail || ''}
                  onChange={(e) => handleInputChange('submitterEmail', e.target.value)}
                  placeholder="your.email@example.com"
                  className={`w-full px-3.5 py-2.5 rounded-lg bg-card border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 ${
                    errors.submitterEmail ? 'border-rose-500 focus:ring-rose-500/50' : 'border-border focus:ring-primary/50'
                  }`}
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Only used for verification questions. Never published or marketed.
                </p>
              </div>
            </div>

            {/* Editorial Notes */}
            <div>
              <label htmlFor="editorial-notes" className="block text-xs font-semibold text-foreground mb-1.5">
                Notes for the Editorial Team (Optional)
              </label>
              <textarea
                id="editorial-notes"
                rows={2}
                value={formData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Mention coupon codes, benchmark scores, self-hosting gotchas, or context about recent updates..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Submission Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Public submissions are editorialized and never automatically published.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-primary-foreground font-bold text-sm shadow-lg shadow-primary/25 cursor-pointer disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Tool...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Tool for Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
