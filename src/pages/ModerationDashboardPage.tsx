import React, { useState, useEffect, useMemo } from 'react';
import type {
  CommunitySubmission,
  ModerationFilterState,
  SubmissionStatus,
  SubmissionType,
} from '../types/submissions';
import {
  getStoredModeratorToken,
  setStoredModeratorToken,
  clearStoredModeratorToken,
  fetchSubmissions,
  updateSubmission,
  publishSubmission,
} from '../services/submissionService';
import { SafeMarkdown } from '../components/SafeMarkdown';
import { registerPublishedTool, registerPublishedGuide } from '../services/aiCatalogService';
import { useRouter } from '../router/Router';
import { AdminDiscoveriesManager } from '../components/AdminDiscoveriesManager';

interface NormalizedSubmissionInfo {
  title: string;
  name: string;
  summary: string;
  category: string;
  pricingType: string;
  websiteUrl?: string;
  sourceCodeUrl?: string;
  submitterName: string;
  submitterEmail?: string;
  submitterRole?: string;
  submitterGithub?: string;
  isAffiliated?: boolean;
  tags: string[];
  content?: string;
  readingTimeMinutes?: number | string;
  slug?: string;
}

const slugify = (str: string) =>
  (str || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

function getSubmissionInfo(sub: CommunitySubmission | null | undefined): NormalizedSubmissionInfo {
  if (!sub) {
    return {
      title: '',
      name: '',
      summary: '',
      category: '',
      pricingType: 'freemium',
      submitterName: 'Community Contributor',
      tags: [],
    };
  }

  const rawLegacy = (sub as any).data || {};

  if (sub.type === 'tool') {
    const t = sub.toolData || rawLegacy;
    const name = t.name || rawLegacy.name || 'Untitled Tool';
    return {
      title: name,
      name,
      summary: t.description || t.shortDescription || rawLegacy.description || rawLegacy.shortDescription || '',
      category: t.category || rawLegacy.category || 'assistants',
      pricingType: t.pricingType || rawLegacy.pricingType || 'freemium',
      websiteUrl: t.websiteUrl || rawLegacy.websiteUrl,
      sourceCodeUrl: t.sourceCodeUrl || t.alternativeTo || rawLegacy.sourceCodeUrl,
      submitterName: t.submitterName || rawLegacy.submitterName || 'Community Contributor',
      submitterEmail: t.submitterEmail || rawLegacy.submitterEmail,
      submitterRole: (t as any).submitterRole || rawLegacy.submitterRole,
      submitterGithub: (t as any).submitterGithub || rawLegacy.submitterGithub,
      isAffiliated: Boolean((t as any).isAffiliated || rawLegacy.isAffiliated),
      tags: Array.isArray(t.features) ? t.features : Array.isArray(t.tags) ? t.tags : [],
      content: t.description || rawLegacy.description || '',
      slug: sub.publishedSlug || (t as any).slug || rawLegacy.slug || slugify(name),
    };
  } else {
    const g = sub.guideData || rawLegacy;
    const title = g.title || rawLegacy.title || 'Untitled Guide';
    return {
      title,
      name: title,
      summary: g.summary || rawLegacy.summary || '',
      category: g.category || rawLegacy.category || 'guides',
      pricingType: '',
      websiteUrl: Array.isArray(g.referenceUrls) && g.referenceUrls[0] ? g.referenceUrls[0] : undefined,
      sourceCodeUrl: undefined,
      submitterName: g.authorName || (g as any).submitterName || rawLegacy.authorName || rawLegacy.submitterName || 'Community Contributor',
      submitterEmail: g.contactEmail || (g as any).submitterEmail || rawLegacy.contactEmail || rawLegacy.submitterEmail,
      submitterRole: (g as any).submitterRole || rawLegacy.submitterRole,
      submitterGithub: (g as any).submitterGithub || rawLegacy.submitterGithub,
      isAffiliated: Boolean((g as any).isAffiliated || rawLegacy.isAffiliated),
      tags: Array.isArray(g.tags) ? g.tags : [],
      content: g.content || rawLegacy.content || '',
      readingTimeMinutes: g.readTime ? parseInt(g.readTime, 10) || 5 : 5,
      slug: sub.publishedSlug || (g as any).slug || rawLegacy.slug || slugify(title),
    };
  }
}

export const ModerationDashboardPage: React.FC = () => {
  const { navigate } = useRouter();

  // Authentication State
  const [token, setToken] = useState<string | null>(() => getStoredModeratorToken());
  const [passkeyInput, setPasskeyInput] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState<'submissions' | 'discoveries'>('submissions');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Submissions Data
  const [submissions, setSubmissions] = useState<CommunitySubmission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filters
  const [filterType, setFilterType] = useState<SubmissionType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<SubmissionStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Submission for Detailed Review / Edit
  const [selectedSubmission, setSelectedSubmission] = useState<CommunitySubmission | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Editable fields for the selected submission
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPricingType, setEditPricingType] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [editTags, setEditTags] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');

  // Synchronize edit form when selectedSubmission changes
  useEffect(() => {
    if (selectedSubmission) {
      const info = getSubmissionInfo(selectedSubmission);
      setEditName(info.name);
      setEditCategory(info.category);
      setEditPricingType(info.pricingType || (selectedSubmission.type === 'tool' ? 'freemium' : ''));
      setEditSummary(info.summary);
      setEditTags(info.tags.join(', '));
      setEditSlug(selectedSubmission.publishedSlug || '');
      setReviewNotes(selectedSubmission.moderatorNotes || '');
      setActionError(null);
    }
  }, [selectedSubmission]);

  // Load Submissions whenever token is valid
  const loadQueue = async (activeToken: string) => {
    setIsLoading(true);
    setFetchError(null);
    const result = await fetchSubmissions(activeToken);
    setIsLoading(false);

    if (result.success) {
      setSubmissions(result.submissions);
      // If selected submission exists, update reference
      if (selectedSubmission) {
        const refreshed = result.submissions.find((s) => s.id === selectedSubmission.id);
        if (refreshed) setSelectedSubmission(refreshed);
      }
    } else {
      if (result.error?.includes('Unauthorized')) {
        clearStoredModeratorToken();
        setToken(null);
        setAuthError('Moderator session expired or invalid passkey.');
      } else {
        setFetchError(result.error || 'Failed to load submissions queue.');
      }
    }
  };

  useEffect(() => {
    if (token) {
      loadQueue(token);
    }
  }, [token]);

  // Handle Passkey Submission
  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkeyInput.trim()) return;

    setIsAuthenticating(true);
    setAuthError(null);

    const enteredToken = passkeyInput.trim();
    const result = await fetchSubmissions(enteredToken);
    setIsAuthenticating(false);

    if (result.success) {
      setStoredModeratorToken(enteredToken);
      setToken(enteredToken);
      setSubmissions(result.submissions);
    } else {
      setAuthError('Incorrect admin passkey. Access denied.');
    }
  };

  const handleSignOut = () => {
    clearStoredModeratorToken();
    setToken(null);
    setSelectedSubmission(null);
    setSubmissions([]);
  };

  // Toast auto-clear
  useEffect(() => {
    if (successToast) {
      const timer = setTimeout(() => setSuccessToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successToast]);

  // Filtered List
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      if (filterType !== 'all' && sub.type !== filterType) return false;
      if (filterStatus !== 'all' && sub.status !== filterStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const info = getSubmissionInfo(sub);
        const matchTitle = info.name.toLowerCase().includes(q);
        const matchAuthor = info.submitterName.toLowerCase().includes(q);
        const matchCat = info.category.toLowerCase().includes(q);
        const matchId = sub.id.toLowerCase().includes(q);
        if (!matchTitle && !matchAuthor && !matchCat && !matchId) return false;
      }
      return true;
    });
  }, [submissions, filterType, filterStatus, searchQuery]);

  // Normalized Info for Selected Submission
  const selectedInfo = useMemo(() => {
    return selectedSubmission ? getSubmissionInfo(selectedSubmission) : null;
  }, [selectedSubmission]);

  // Stats Counters
  const stats = useMemo(() => {
    const total = submissions.length;
    const pending = submissions.filter((s) => s.status === 'pending').length;
    const inReview = submissions.filter((s) => s.status === 'in_review').length;
    const approved = submissions.filter((s) => s.status === 'approved' || s.status === 'published').length;
    const rejected = submissions.filter((s) => s.status === 'rejected').length;
    return { total, pending, inReview, approved, rejected };
  }, [submissions]);

  // Action: Save Edits & Review Notes
  const handleSaveEdits = async () => {
    if (!token || !selectedSubmission) return;
    setIsProcessingAction(true);
    setActionError(null);

    const tagsArray = editTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const updatePayload: any = {
      moderatorNotes: reviewNotes,
      publishedSlug: editSlug.trim() || undefined,
    };

    if (selectedSubmission.type === 'tool') {
      updatePayload.toolData = {
        ...(selectedSubmission.toolData || {}),
        name: editName,
        category: editCategory,
        pricingType: editPricingType.toLowerCase().replace(/\s+/g, '-'),
        description: editSummary,
        features: tagsArray,
      };
    } else {
      updatePayload.guideData = {
        ...(selectedSubmission.guideData || {}),
        title: editName,
        category: editCategory,
        summary: editSummary,
        tags: tagsArray,
      };
    }

    const res = await updateSubmission(
      selectedSubmission.id,
      updatePayload,
      token
    );

    setIsProcessingAction(false);
    if (res.success && res.submission) {
      setSelectedSubmission(res.submission);
      setSubmissions((prev) =>
        prev.map((s) => (s.id === res.submission!.id ? res.submission! : s))
      );
      setSuccessToast('Editorial corrections saved successfully.');
    } else {
      setActionError(res.error || 'Failed to save changes.');
    }
  };

  // Action: Change Status (Approved / In Review / Rejected)
  const handleStatusChange = async (newStatus: SubmissionStatus) => {
    if (!token || !selectedSubmission) return;
    setIsProcessingAction(true);
    setActionError(null);

    const res = await updateSubmission(
      selectedSubmission.id,
      { status: newStatus, moderatorNotes: reviewNotes },
      token
    );

    setIsProcessingAction(false);
    if (res.success && res.submission) {
      setSelectedSubmission(res.submission);
      setSubmissions((prev) =>
        prev.map((s) => (s.id === res.submission!.id ? res.submission! : s))
      );
      setSuccessToast(`Submission marked as "${newStatus.replace('_', ' ')}".`);
    } else {
      setActionError(res.error || 'Failed to update submission status.');
    }
  };

  // Action: Publish to Live Catalog
  const handlePublish = async () => {
    if (!token || !selectedSubmission) return;
    const info = getSubmissionInfo(selectedSubmission);
    if (
      !confirm(
        `Are you sure you want to publish "${info.name}" to the live catalog? It will immediately appear on public catalog pages.`
      )
    ) {
      return;
    }

    setIsProcessingAction(true);
    setActionError(null);

    // Save any pending edits first
    await handleSaveEdits();

    const res = await publishSubmission(selectedSubmission.id, token);
    setIsProcessingAction(false);

    if (res.success) {
      setSuccessToast(
        `Published successfully! Available at ${res.publishedUrl || 'live catalog'}.`
      );
      // Reload full queue
      loadQueue(token);
    } else {
      setActionError(res.error || 'Failed to publish submission.');
    }
  };

  // Helper Badge Color
  const getStatusBadge = (status: SubmissionStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'in_review':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'approved':
      case 'published':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // 1. Password Protection Modal View
  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white border border-[#DFE7F3] rounded-2xl p-8 shadow-xl relative overflow-hidden">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Editorial Moderation</h1>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              Enter your editorial access passkey to review community tool and guide submissions.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Moderator Passkey
              </label>
              <input
                type="password"
                value={passkeyInput}
                onChange={(e) => setPasskeyInput(e.target.value)}
                placeholder="Enter secret passkey..."
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DFE7F3] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition-all"
              />
            </div>

            {authError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isAuthenticating ? (
                <span>Verifying passkey...</span>
              ) : (
                <>
                  <span>Unlock Moderation Queue</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#DFE7F3] text-center">
            <p className="text-xs text-slate-500">
              Local editorial key: <code className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-mono text-[11px] border border-blue-200 font-semibold">techhacks-admin-2026</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-white border border-emerald-300 text-emerald-800 shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <svg className="w-5 h-5 flex-shrink-0 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-semibold">{successToast}</span>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-[#DFE7F3]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Editorial Moderation Queue</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Admin Verified
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
            Review community AI tools and technical guides before publishing them to the live Tech Hacks AI catalog.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => token && loadQueue(token)}
            disabled={isLoading}
            className="p-2 rounded-xl bg-white border border-[#DFE7F3] hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-2 text-sm px-3 shadow-xs cursor-pointer"
            title="Refresh queue"
          >
            <svg
              className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="font-medium">Refresh</span>
          </button>

          <button
            onClick={handleSignOut}
            className="p-2 rounded-xl bg-white border border-[#DFE7F3] hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-600 transition-colors flex items-center gap-2 text-sm px-3 shadow-xs cursor-pointer"
            title="Lock session"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">Lock</span>
          </button>
        </div>
      </div>

      {/* Admin Section Tabs */}
      <div className="flex items-center gap-2 mt-6 mb-8 border-b border-[#DFE7F3] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveAdminTab('submissions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'submissions'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Community Submissions</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-white/20 text-white font-bold">
            {stats.pending > 0 ? `${stats.pending} pending` : stats.total}
          </span>
        </button>

        <button
          onClick={() => setActiveAdminTab('discoveries')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'discoveries'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Daily Discoveries &amp; Featured Tools</span>
        </button>
      </div>

      {activeAdminTab === 'discoveries' ? (
        <AdminDiscoveriesManager token={token} />
      ) : (
        <>
          {/* Metrics Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 my-6">
            <div
              onClick={() => setFilterStatus('all')}
              className={`cursor-pointer p-4 rounded-xl border bg-white transition-all shadow-xs ${
                filterStatus === 'all' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-[#DFE7F3] hover:border-slate-300'
              }`}
            >
              <div className="text-xs text-slate-500 font-semibold">Total Submissions</div>
              <div className="text-2xl font-bold mt-1 text-slate-900">{stats.total}</div>
            </div>

            <div
              onClick={() => setFilterStatus('pending')}
              className={`cursor-pointer p-4 rounded-xl border bg-white transition-all shadow-xs ${
                filterStatus === 'pending' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-[#DFE7F3] hover:border-slate-300'
              }`}
            >
              <div className="text-xs text-amber-700 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Pending Review
              </div>
              <div className="text-2xl font-bold mt-1 text-amber-700">{stats.pending}</div>
            </div>

            <div
              onClick={() => setFilterStatus('in_review')}
              className={`cursor-pointer p-4 rounded-xl border bg-white transition-all shadow-xs ${
                filterStatus === 'in_review' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-[#DFE7F3] hover:border-slate-300'
              }`}
            >
              <div className="text-xs text-blue-700 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                In Review
              </div>
              <div className="text-2xl font-bold mt-1 text-blue-700">{stats.inReview}</div>
            </div>

            <div
              onClick={() => setFilterStatus('published')}
              className={`cursor-pointer p-4 rounded-xl border bg-white transition-all shadow-xs ${
                filterStatus === 'published' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-[#DFE7F3] hover:border-slate-300'
              }`}
            >
              <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Published Live
              </div>
              <div className="text-2xl font-bold mt-1 text-emerald-700">{stats.approved}</div>
            </div>

            <div
              onClick={() => setFilterStatus('rejected')}
              className={`cursor-pointer p-4 rounded-xl border bg-white transition-all shadow-xs ${
                filterStatus === 'rejected' ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-[#DFE7F3] hover:border-slate-300'
              }`}
            >
              <div className="text-xs text-rose-700 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Rejected
              </div>
              <div className="text-2xl font-bold mt-1 text-rose-700">{stats.rejected}</div>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-4 rounded-2xl bg-white border border-[#DFE7F3] mb-6 shadow-xs">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Type Filter */}
              <div className="flex p-1 rounded-xl bg-slate-100 border border-slate-200">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    filterType === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Types
                </button>
                <button
                  onClick={() => setFilterType('tool')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    filterType === 'tool'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  AI Tools
                </button>
                <button
                  onClick={() => setFilterType('guide')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    filterType === 'guide'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Guides
                </button>
              </div>

              {/* Status Dropdown */}
              <select
                aria-label="Filter submissions by status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl bg-white border border-[#DFE7F3] text-slate-900 text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                <option value="all">Status: All</option>
                <option value="pending">Pending</option>
                <option value="in_review">In Review</option>
                <option value="approved">Approved</option>
                <option value="published">Published</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, author, tag..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-[#DFE7F3] text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              <svg
                className="w-4 h-4 absolute left-3 top-2 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {fetchError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm mb-6 flex items-center justify-between">
              <span>{fetchError}</span>
              <button
                onClick={() => token && loadQueue(token)}
                className="underline hover:no-underline text-xs cursor-pointer font-semibold"
              >
                Retry
              </button>
            </div>
          )}

          {/* Main Layout: List & Detail Drawer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Submissions List */}
            <div className={`space-y-3 ${selectedSubmission ? 'lg:col-span-5' : 'lg:col-span-12'}`}>
              {filteredSubmissions.length === 0 ? (
                <div className="text-center py-16 bg-white border border-dashed border-slate-300 rounded-2xl p-8">
                  <svg className="w-12 h-12 mx-auto text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="text-base font-semibold text-slate-900">No submissions found</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                    No items match your selected filters. Submissions submitted from <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700 border border-slate-200">/submit-tool</code> or <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700 border border-slate-200">/submit-guide</code> will appear here.
                  </p>
                </div>
              ) : (
                filteredSubmissions.map((sub) => {
                  const isSelected = selectedSubmission?.id === sub.id;
                  const info = getSubmissionInfo(sub);
                  const dateStr = sub.createdAt ? new Date(sub.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }) : '';

                  return (
                    <div
                      key={sub.id}
                      onClick={() => setSelectedSubmission(sub)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? 'bg-blue-50/50 border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                          : 'bg-white border-[#DFE7F3] hover:border-blue-300 hover:bg-slate-50/80 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              sub.type === 'tool'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-purple-50 text-purple-700 border border-purple-200'
                            }`}
                          >
                            {sub.type === 'tool' ? 'AI Tool' : 'Guide'}
                          </span>

                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                              sub.status
                            )}`}
                          >
                            {(sub.status || 'pending').replace('_', ' ')}
                          </span>
                        </div>

                        <span className="text-[11px] text-slate-500">{dateStr}</span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 line-clamp-1">{info.name}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">{info.summary}</p>

                      {/* Duplicate warning tag if present */}
                      {sub.potentialDuplicate && (
                        <div className="mt-2.5 px-2 py-1 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 flex-shrink-0 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <span className="truncate font-medium">Duplicate match flagged</span>
                        </div>
                      )}

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="truncate">
                          By <strong className="text-slate-900 font-medium">{info.submitterName}</strong>
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">{sub.id}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Detailed Review & Edit Panel */}
            {selectedSubmission && selectedInfo && (
              <div className="lg:col-span-7 bg-white border border-[#DFE7F3] rounded-2xl p-6 shadow-xl relative space-y-6">
                {/* Drawer Header */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#DFE7F3]">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          selectedSubmission.type === 'tool'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-purple-50 text-purple-700 border border-purple-200'
                        }`}
                      >
                        {selectedSubmission.type === 'tool' ? 'AI Tool Submission' : 'Guide Submission'}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                          selectedSubmission.status
                        )}`}
                      >
                        {(selectedSubmission.status || 'pending').replace('_', ' ')}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {selectedInfo.name}
                    </h2>
                    <div className="text-xs text-slate-500 mt-0.5">
                      ID: <code className="font-mono text-blue-700 font-semibold">{selectedSubmission.id}</code> · Received{' '}
                      {selectedSubmission.createdAt ? new Date(selectedSubmission.createdAt).toLocaleString() : ''}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                    title="Close drawer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Error Message */}
                {actionError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{actionError}</span>
                  </div>
                )}

                {/* Potential Duplicate Banner */}
                {selectedSubmission.potentialDuplicate && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-2 text-amber-900">
                      <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>Potential Catalog Duplicate Detected</span>
                    </div>
                    <p className="text-amber-800 pl-6 leading-relaxed">
                      {selectedSubmission.duplicateReason ||
                        'A tool with a matching name or domain already exists in the catalog.'}
                    </p>
                  </div>
                )}

                {/* Submitter Attribution Box */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Submitted By</span>
                    <span className="font-semibold text-slate-900">
                      {selectedInfo.submitterName}
                    </span>
                    {selectedInfo.submitterEmail && (
                      <span className="text-slate-500 block mt-0.5">
                        {selectedInfo.submitterEmail}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Submission Context</span>
                    <span className="text-slate-700">
                      {selectedSubmission.type === 'tool'
                        ? selectedSubmission.toolData?.notes || 'Community submission'
                        : selectedSubmission.guideData?.notes || 'Community tutorial'}
                    </span>
                    {selectedSubmission.type === 'tool' && selectedSubmission.toolData?.alternativeTo && (
                      <span className="text-slate-500 block truncate mt-0.5">
                        Alternative to: {selectedSubmission.toolData.alternativeTo}
                      </span>
                    )}
                  </div>
                </div>

                {/* Official Link Out */}
                {selectedSubmission.type === 'tool' && (
                  <div className="flex flex-wrap items-center gap-3">
                    {selectedInfo.websiteUrl && (
                      <a
                        href={selectedInfo.websiteUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 text-xs font-semibold transition-colors"
                      >
                        <span>Visit Official Website</span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}

                    {selectedInfo.sourceCodeUrl && (
                      <a
                        href={selectedInfo.sourceCodeUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
                      >
                        <span>View Repository / Reference</span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                )}

                {/* Guide Content Markdown Preview */}
                {selectedSubmission.type === 'guide' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Submitted Guide Article Content
                      </label>
                      <span className="text-xs text-slate-500">
                        ~{selectedInfo.readingTimeMinutes || 5} min read
                      </span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 max-h-72 overflow-y-auto text-sm text-slate-800">
                      <SafeMarkdown content={selectedInfo.content || selectedInfo.summary || ''} />
                    </div>
                  </div>
                )}

                {/* Editorial Correction Fields */}
                <div className="space-y-4 pt-2 border-t border-[#DFE7F3]">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Editorial Review &amp; Corrections
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Display Name / Title
                      </label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#DFE7F3] text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#DFE7F3] text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    {selectedSubmission.type === 'tool' && (
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Pricing Model
                        </label>
                        <select
                          aria-label="Pricing model"
                          value={editPricingType.toLowerCase()}
                          onChange={(e) => setEditPricingType(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#DFE7F3] text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        >
                          <option value="free">Free</option>
                          <option value="freemium">Freemium</option>
                          <option value="open-source">Open Source</option>
                          <option value="paid">Paid</option>
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Published Slug (Optional custom slug)
                      </label>
                      <input
                        type="text"
                        value={editSlug}
                        onChange={(e) => setEditSlug(e.target.value)}
                        placeholder="e.g. jan-ai"
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#DFE7F3] text-slate-900 text-xs font-mono focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Summary / Short Description
                    </label>
                    <textarea
                      rows={2}
                      value={editSummary}
                      onChange={(e) => setEditSummary(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#DFE7F3] text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={editTags}
                      onChange={(e) => setEditTags(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#DFE7F3] text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Internal Editorial Review Notes
                    </label>
                    <textarea
                      rows={2}
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Notes on verified pricing, test results, reasons for rejection or publication..."
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#DFE7F3] text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveEdits}
                      disabled={isProcessingAction}
                      className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                    >
                      Save Editorial Edits
                    </button>
                  </div>
                </div>

                {/* Moderation Workflow Actions */}
                <div className="pt-4 border-t border-[#DFE7F3] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleStatusChange('in_review')}
                      disabled={isProcessingAction || selectedSubmission.status === 'in_review'}
                      className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      Mark In Review
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange('rejected')}
                      disabled={isProcessingAction || selectedSubmission.status === 'rejected'}
                      className="px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      Reject Submission
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange('approved')}
                      disabled={
                        isProcessingAction ||
                        selectedSubmission.status === 'approved' ||
                        selectedSubmission.status === 'published'
                      }
                      className="px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      Mark Approved
                    </button>
                  </div>

                  <div>
                    {selectedSubmission.status === 'published' ? (
                      <a
                        href={
                          selectedSubmission.type === 'tool'
                            ? `/ai-tools/${selectedSubmission.publishedSlug || selectedInfo.slug || slugify(selectedInfo.name)}`
                            : `/guides/${selectedSubmission.publishedSlug || selectedInfo.slug || slugify(selectedInfo.name)}`
                        }
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 text-xs font-bold transition-colors"
                      >
                        <span>View Live in Catalog</span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={handlePublish}
                        disabled={isProcessingAction}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-md shadow-blue-600/25 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Publish to Live Catalog</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
