import React, { useState, useMemo } from 'react';
import { Link } from '../router/Router';
import { submitGuide } from '../services/submissionService';
import type { GuideSubmissionData } from '../types/submissions';
import { guideCategories } from '../data/guidesData';
import { SafeMarkdown } from '../components/SafeMarkdown';
import {
  BookOpen,
  PenTool,
  CheckCircle2,
  AlertTriangle,
  Send,
  Loader2,
  Eye,
  Edit3,
  Clock,
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  Code2,
  Link2,
  ShieldCheck,
  User,
  Sparkles,
  Layers,
} from 'lucide-react';

export const SubmitGuidePage: React.FC = () => {
  const [formData, setFormData] = useState<GuideSubmissionData>({
    title: '',
    summary: '',
    content: '',
    category: '',
    coverImageUrl: '',
    tags: [],
    relatedTools: [],
    difficulty: 'intermediate',
    authorName: '',
    contactEmail: '',
    referenceUrls: [],
    notes: '',
  });

  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [tagsInput, setTagsInput] = useState('');
  const [relatedToolsInput, setRelatedToolsInput] = useState('');
  const [referenceUrlsInput, setReferenceUrlsInput] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{ id: string; duplicateWarning?: boolean; reason?: string } | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Live auto-calculated read time & word count
  const wordCount = useMemo(() => {
    return formData.content.split(/\s+/).filter(Boolean).length;
  }, [formData.content]);

  const estimatedMinutes = useMemo(() => {
    return Math.max(1, Math.ceil(wordCount / 200));
  }, [wordCount]);

  const handleInputChange = (field: keyof GuideSubmissionData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleTagsChange = (text: string) => {
    setTagsInput(text);
    const parsed = text.split(',').map((t) => t.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, tags: parsed }));
  };

  const handleRelatedToolsChange = (text: string) => {
    setRelatedToolsInput(text);
    const parsed = text.split(',').map((t) => t.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, relatedTools: parsed }));
  };

  const handleReferenceUrlsChange = (text: string) => {
    setReferenceUrlsInput(text);
    const parsed = text.split('\n').map((u) => u.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, referenceUrls: parsed }));
  };

  // Quick markdown insertion helper
  const insertMarkdown = (prefix: string, suffix = '') => {
    const textarea = document.getElementById('guide-content') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = formData.content;
    const selected = current.slice(start, end) || 'text';
    const replacement = `${prefix}${selected}${suffix}`;

    const updated = current.slice(0, start) + replacement + current.slice(end);
    handleInputChange('content', updated);

    // Refocus
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 50);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Guide title is required.';
    } else if (formData.title.trim().length < 10 || formData.title.trim().length > 120) {
      newErrors.title = 'Title must be between 10 and 120 characters.';
    }

    if (!formData.summary.trim()) {
      newErrors.summary = 'Summary is required.';
    } else if (formData.summary.trim().length < 20 || formData.summary.trim().length > 300) {
      newErrors.summary = 'Summary must be between 20 and 300 characters.';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Guide content is required.';
    } else if (formData.content.trim().length < 100) {
      newErrors.content = 'Guide content is too short. Please provide at least 100 characters.';
    } else if (formData.content.trim().length > 15000) {
      newErrors.content = 'Content must not exceed 15,000 characters.';
    }

    if (!formData.category) {
      newErrors.category = 'Please choose a primary category/topic.';
    }

    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail.trim())) {
      newErrors.contactEmail = 'Please provide a valid email address.';
    }

    if (formData.coverImageUrl && !/^https?:\/\/.+\..+/i.test(formData.coverImageUrl.trim())) {
      newErrors.coverImageUrl = 'Cover image URL must be a valid http:// or https:// address.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validate()) {
      setActiveTab('write');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await submitGuide(
        {
          ...formData,
          readTime: `${estimatedMinutes} min read`,
        },
        honeypot
      );

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
      setGeneralError(err?.message || 'A network error occurred. Your entered guide content has been preserved.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      title: '',
      summary: '',
      content: '',
      category: '',
      coverImageUrl: '',
      tags: [],
      relatedTools: [],
      difficulty: 'intermediate',
      authorName: '',
      contactEmail: '',
      referenceUrls: [],
      notes: '',
    });
    setTagsInput('');
    setRelatedToolsInput('');
    setReferenceUrlsInput('');
    setSubmissionSuccess(null);
    setErrors({});
    setGeneralError(null);
    setActiveTab('write');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Navigation Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link to="/guides" className="hover:text-foreground">Guides</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Submit a Guide</span>
      </nav>

      {/* Header Banner */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
          <PenTool className="w-4 h-4" />
          <span>Community Educational Guides</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">
          Submit an AI Guide or Tutorial
        </h1>
        <p className="text-sm sm:text-base text-secondary-foreground max-w-2xl leading-relaxed">
          Share your hands-on AI workflows, integration patterns, and prompt recipes. All guides are fact-checked, formatted with copyable prompts, and attributed to the author upon editorial approval.
        </p>
      </div>

      {/* Success Confirmation View */}
      {submissionSuccess ? (
        <div className="p-8 rounded-2xl border border-emerald-500/30 bg-card/90 shadow-xl text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-2">Guide Submission Received!</h2>
          <p className="text-sm text-secondary-foreground max-w-lg mx-auto mb-4 leading-relaxed">
            Thank you for sharing your knowledge! Your guide submission for <strong className="text-foreground">&quot;{formData.title}&quot;</strong> has been recorded with reference ID:
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
                  <span>{submissionSuccess.reason} Our editorial team will review whether this expands upon or covers distinct angles.</span>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 rounded-xl bg-card border border-border text-xs text-muted-foreground max-w-md mx-auto mb-8 text-left space-y-1.5">
            <div className="font-semibold text-foreground flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>Review &amp; Publication Workflow:</span>
            </div>
            <p>1. Editors review the tutorial steps for clarity, accuracy, and working links.</p>
            <p>2. Prompt templates are validated with the target AI models.</p>
            <p>3. Upon approval, your guide is published with author credit in the Guides directory.</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleResetForm}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-sm transition-all"
            >
              Submit Another Guide
            </button>
            <Link
              to="/guides"
              className="px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-medium text-sm transition-all"
            >
              Explore Existing Guides
            </Link>
          </div>
        </div>
      ) : (
        /* Form View */
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          {/* Honeypot field */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="guide_hp">Leave this field blank</label>
            <input
              type="text"
              id="guide_hp"
              name="guide_hp"
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

          {/* Section 1: Guide Overview */}
          <div className="p-6 sm:p-7 rounded-2xl border border-border bg-card/80 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-border/60">
              <BookOpen className="w-4 h-4 text-primary" />
              <h2 className="text-base font-bold text-foreground">1. Guide Metadata</h2>
            </div>

            <div>
              <label htmlFor="guide-title" className="block text-xs font-semibold text-foreground mb-1.5">
                Guide Title <span className="text-rose-400">*</span>
              </label>
              <input
                id="guide-title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g. How to Build Full-Stack AI Apps in Hours with Cursor and Supabase"
                className={`w-full px-3.5 py-2.5 rounded-lg bg-card border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 ${
                  errors.title ? 'border-rose-500 focus:ring-rose-500/50' : 'border-border focus:ring-primary/50'
                }`}
              />
              {errors.title ? (
                <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.title}</p>
              ) : (
                <p className="text-[11px] text-muted-foreground mt-1">
                  Catchy, descriptive title explaining the outcome of this guide (10–120 characters).
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Category */}
              <div>
                <label htmlFor="guide-category" className="block text-xs font-semibold text-foreground mb-1.5">
                  Topic / Category <span className="text-rose-400">*</span>
                </label>
                <select
                  id="guide-category"
                  required
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-lg bg-card border text-foreground text-sm focus:outline-none focus:ring-2 ${
                    errors.category ? 'border-rose-500 focus:ring-rose-500/50' : 'border-border focus:ring-primary/50'
                  }`}
                >
                  <option value="">Select topic...</option>
                  {guideCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                  <option value="voice-audio">AI Voice &amp; Audio</option>
                  <option value="data-analytics">Data Analytics &amp; Automation</option>
                </select>
                {errors.category && (
                  <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.category}</p>
                )}
              </div>

              {/* Difficulty Level */}
              <div>
                <label htmlFor="guide-difficulty" className="block text-xs font-semibold text-foreground mb-1.5">
                  Difficulty Level
                </label>
                <select
                  id="guide-difficulty"
                  value={formData.difficulty}
                  onChange={(e) => handleInputChange('difficulty', e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="beginner">Beginner (No coding required)</option>
                  <option value="intermediate">Intermediate (Basic developer/creator tools)</option>
                  <option value="advanced">Advanced (APIs, deployment, complex orchestration)</option>
                </select>
              </div>
            </div>

            {/* Short Summary */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="guide-summary" className="block text-xs font-semibold text-foreground">
                  Short Summary / Executive Abstract <span className="text-rose-400">*</span>
                </label>
                <span className="text-[11px] text-muted-foreground">{formData.summary.length}/300 chars</span>
              </div>
              <textarea
                id="guide-summary"
                required
                rows={2}
                value={formData.summary}
                onChange={(e) => handleInputChange('summary', e.target.value)}
                placeholder="A concise 1-2 sentence overview of what readers will learn and achieve..."
                className={`w-full px-3.5 py-2.5 rounded-lg bg-card border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 leading-relaxed ${
                  errors.summary ? 'border-rose-500 focus:ring-rose-500/50' : 'border-border focus:ring-primary/50'
                }`}
              />
              {errors.summary && (
                <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.summary}</p>
              )}
            </div>
          </div>

          {/* Section 2: Main Guide Content (Markdown Editor & Live Preview) */}
          <div className="p-6 sm:p-7 rounded-2xl border border-border bg-card/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-purple-400" />
                <h2 className="text-base font-bold text-foreground">
                  2. Guide Content <span className="text-rose-400">*</span>
                </h2>
              </div>

              {/* Word Count & Read Time Meter */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                <span>{wordCount} words</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-primary font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>~{estimatedMinutes} min read</span>
                </span>
              </div>
            </div>

            {/* Tabs & Formatting Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-muted/60 p-2 rounded-xl border border-border/60">
              {/* Tab Switcher */}
              <div className="flex items-center bg-card rounded-lg p-0.5 border border-border">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    activeTab === 'write'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Write Markdown</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    activeTab === 'preview'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Live Preview</span>
                </button>
              </div>

              {/* Formatting Helper Buttons */}
              {activeTab === 'write' && (
                <div className="flex items-center gap-1 flex-wrap">
                  <button
                    type="button"
                    onClick={() => insertMarkdown('**', '**')}
                    className="p-1.5 rounded hover:bg-card text-muted-foreground hover:text-foreground transition-colors"
                    title="Bold (**text**)"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('*', '*')}
                    className="p-1.5 rounded hover:bg-card text-muted-foreground hover:text-foreground transition-colors"
                    title="Italic (*text*)"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('\n## ')}
                    className="p-1.5 rounded hover:bg-card text-muted-foreground hover:text-foreground transition-colors"
                    title="Section Heading (##)"
                  >
                    <Heading2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('\n### ')}
                    className="p-1.5 rounded hover:bg-card text-muted-foreground hover:text-foreground transition-colors"
                    title="Subheading (###)"
                  >
                    <Heading3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('\n- ')}
                    className="p-1.5 rounded hover:bg-card text-muted-foreground hover:text-foreground transition-colors"
                    title="Bullet List (- item)"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('\n```\n', '\n```\n')}
                    className="p-1.5 rounded hover:bg-card text-muted-foreground hover:text-foreground transition-colors"
                    title="Code Block"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('[', '](https://example.com)')}
                    className="p-1.5 rounded hover:bg-card text-muted-foreground hover:text-foreground transition-colors"
                    title="Link [text](url)"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Editor Area */}
            {activeTab === 'write' ? (
              <div>
                <textarea
                  id="guide-content"
                  required
                  rows={14}
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder={`## 1. Overview & Setup
Explain prerequisite accounts or installed packages...

## 2. Master Prompt / Core Configuration
Share the exact tested prompt or configuration settings:
\`\`\`
Prompt template here...
\`\`\`

## 3. Post-Processing & Output
Step-by-step workflow for combining or refining the result...`}
                  className={`w-full p-4 rounded-xl bg-card border font-mono text-xs sm:text-sm text-foreground leading-relaxed focus:outline-none focus:ring-2 ${
                    errors.content ? 'border-rose-500 focus:ring-rose-500/50' : 'border-border focus:ring-primary/50'
                  }`}
                />
                {errors.content ? (
                  <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.content}</p>
                ) : (
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Use Markdown for headings, code snippets, and lists. User-generated content is sanitized to prevent XSS.
                  </p>
                )}
              </div>
            ) : (
              /* Live Preview */
              <div className="p-5 rounded-xl border border-border bg-card min-h-[320px] max-h-[500px] overflow-y-auto">
                {formData.content.trim() ? (
                  <SafeMarkdown content={formData.content} />
                ) : (
                  <p className="text-muted-foreground text-xs italic text-center py-12">
                    Start typing your guide content in the &quot;Write Markdown&quot; tab to view the live preview here.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Section 3: Related Tools & Tags */}
          <div className="p-6 sm:p-7 rounded-2xl border border-border bg-card/80 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-border/60">
              <Layers className="w-4 h-4 text-blue-400" />
              <h2 className="text-base font-bold text-foreground">3. Related Tools &amp; Tagging</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Related AI Tools */}
              <div>
                <label htmlFor="related-tools" className="block text-xs font-semibold text-foreground mb-1.5">
                  Featured / Related AI Tools (Comma-separated)
                </label>
                <input
                  id="related-tools"
                  type="text"
                  value={relatedToolsInput}
                  onChange={(e) => handleRelatedToolsChange(e.target.value)}
                  placeholder="e.g. flux-1, runway, elevenlabs, cursor"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Tool names or slugs referenced throughout the tutorial.
                </p>
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags-input" className="block text-xs font-semibold text-foreground mb-1.5">
                  Tags &amp; Keywords (Comma-separated)
                </label>
                <input
                  id="tags-input"
                  type="text"
                  value={tagsInput}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder="e.g. video, prompt-engineering, nextjs, supabase"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Topics to aid discovery in search.
                </p>
              </div>
            </div>

            {/* Reference URLs */}
            <div>
              <label htmlFor="reference-urls" className="block text-xs font-semibold text-foreground mb-1.5">
                Reference Documentation or Source Code Repositories (One per line, optional)
              </label>
              <textarea
                id="reference-urls"
                rows={2}
                value={referenceUrlsInput}
                onChange={(e) => handleReferenceUrlsChange(e.target.value)}
                placeholder="https://github.com/example/repo&#10;https://docs.anthropic.com/en/docs"
                className="w-full px-3.5 py-2.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Section 4: Author Attribution */}
          <div className="p-6 sm:p-7 rounded-2xl border border-border bg-card/80 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-border/60">
              <User className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base font-bold text-foreground">4. Author Attribution</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Author Name */}
              <div>
                <label htmlFor="author-name" className="block text-xs font-semibold text-foreground mb-1.5">
                  Author Name / Handle (Optional)
                </label>
                <input
                  id="author-name"
                  type="text"
                  value={formData.authorName || ''}
                  onChange={(e) => handleInputChange('authorName', e.target.value)}
                  placeholder="e.g. Alex Chen or @alex_developer"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Displays as the verified tutorial author.
                </p>
              </div>

              {/* Contact Email */}
              <div>
                <label htmlFor="contact-email" className="block text-xs font-semibold text-foreground mb-1.5">
                  Contact Email (Optional)
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={formData.contactEmail || ''}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  placeholder="your.email@example.com"
                  className={`w-full px-3.5 py-2.5 rounded-lg bg-card border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 ${
                    errors.contactEmail ? 'border-rose-500 focus:ring-rose-500/50' : 'border-border focus:ring-primary/50'
                  }`}
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Only used for editorial communication. Never made public.
                </p>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="editorial-notes" className="block text-xs font-semibold text-foreground mb-1.5">
                Notes for Editors (Optional)
              </label>
              <textarea
                id="editorial-notes"
                rows={2}
                value={formData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Mention tested model versions, GPU requirements, or links to working demos..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Submission Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Guides are reviewed by technical editors before publication.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-primary-foreground font-bold text-sm shadow-lg shadow-primary/25 cursor-pointer disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Guide...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Guide for Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
