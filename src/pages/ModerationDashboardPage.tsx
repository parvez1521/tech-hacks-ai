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
import { AdminPromptManager } from '../components/AdminPromptManager';

export const ModerationDashboardPage: React.FC = () => {
  const { navigate } = useRouter();

  // Authentication State
  const [token, setToken] = useState<string | null>(() => getStoredModeratorToken());
  const [passkeyInput, setPasskeyInput] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState<'submissions' | 'discoveries' | 'prompts'>('submissions');
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
      if (selectedSubmission.type === 'tool') {
        setEditName(selectedSubmission.toolData?.name || '');
        setEditCategory(selectedSubmission.toolData?.category || '');
        setEditPricingType(selectedSubmission.toolData?.pricingType || 'freemium');
        setEditSummary(selectedSubmission.toolData?.description || '');
        setEditTags((selectedSubmission.toolData?.tags || []).join(', '));
      } else {
        setEditName(selectedSubmission.guideData?.title || '');
        setEditCategory(selectedSubmission.guideData?.category || '');
        setEditPricingType('');
        setEditSummary(selectedSubmission.guideData?.summary || '');
        setEditTags((selectedSubmission.guideData?.tags || []).join(', '));
      }
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
        const title = sub.type === 'tool' ? sub.toolData?.name : sub.guideData?.title;
        const author = sub.type === 'tool' ? sub.toolData?.submitterName : sub.guideData?.authorName;
        const category = sub.type === 'tool' ? sub.toolData?.category : sub.guideData?.category;
        const matchTitle = title?.toLowerCase().includes(q);
        const matchAuthor = author?.toLowerCase().includes(q);
        const matchCat = category?.toLowerCase().includes(q);
        const matchId = sub.id.toLowerCase().includes(q);
        if (!matchTitle && !matchAuthor && !matchCat && !matchId) return false;
      }
      return true;
    });
  }, [submissions, filterType, filterStatus, searchQuery]);

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
    if (!token || !selectedSubmission) return false;
    setIsProcessingAction(true);
    setActionError(null);

    const tags = editTags.split(',').map((t) => t.trim()).filter(Boolean);
    const updatedData = selectedSubmission.type === 'tool'
      ? {
          ...(selectedSubmission.toolData || {}),
          name: editName,
          category: editCategory,
          pricingType: editPricingType,
          description: editSummary,
          tags,
        }
      : {
          ...(selectedSubmission.guideData || {}),
          title: editName,
          category: editCategory,
          summary: editSummary,
          tags,
        };

    const res = await updateSubmission(
      selectedSubmission.id,
      {
        ...(selectedSubmission.type === 'tool' ? { toolData: updatedData } : { guideData: updatedData }),
        moderatorNotes: reviewNotes,
        publishedSlug: editSlug.trim() || undefined,
      },
      token
    );

    setIsProcessingAction(false);
    if (res.success && res.submission) {
      setSelectedSubmission(res.submission);
      setSubmissions((prev) =>
        prev.map((s) => (s.id === res.submission!.id ? res.submission! : s))
      );
      setSuccessToast('Submission fields and notes updated successfully.');
      return true;
    } else {
      setActionError(res.error || 'Failed to save changes.');
      return false;
    }
  };

  // Action: Update Status (In Review, Reject, Approve)
  const handleStatusChange = async (newStatus: SubmissionStatus) => {
    if (!token || !selectedSubmission) return;
    setIsProcessingAction(true);
    setActionError(null);

    const res = await updateSubmission(
      selectedSubmission.id,
      {
        status: newStatus,
        moderatorNotes: reviewNotes,
      },
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
    if (selectedSubmission.status !== 'approved') {
      setActionError('Mark this submission approved before publishing it to the catalog.');
      return;
    }
    if (
      !confirm(
        `Are you sure you want to publish "${
          selectedSubmission.type === 'tool'
            ? selectedSubmission.toolData?.name
            : selectedSubmission.guideData?.title
        }" to the live catalog? It will immediately appear on public catalog pages.`
      )
    ) {
      return;
    }

    setIsProcessingAction(true);
    setActionError(null);

    // Save any pending edits first
    const saved = await handleSaveEdits();
    if (!saved) {
      setIsProcessingAction(false);
      return;
    }

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
        return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30';
      case 'in_review':
        return 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/30';
      case 'approved':
      case 'published':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30';
      case 'rejected':
        return 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  // If Not Authenticated: Render Passkey Gate
  if (!token) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-cyan-500 to-indigo-500" />
          
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 text-primary">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Editorial Moderation</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your editorial access passkey to review community submissions, discoveries, and prompt recipes.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Moderator Passkey
              </label>
              <input
                type="password"
                value={passkeyInput}
                onChange={(e) => setPasskeyInput(e.target.value)}
                placeholder="Enter secret passkey..."
                required
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>

            {authError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
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

          <div className="mt-6 pt-5 border-t border-border/60 text-center">
            <p className="text-xs text-muted-foreground">
              Use the server-side <code className="text-foreground bg-muted px-1.5 py-0.5 rounded font-mono text-[11px]">ADMIN_SECRET</code> configured for this environment.
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
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-card border border-emerald-500/40 text-emerald-400 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <svg className="w-5 h-5 flex-shrink-0 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">{successToast}</span>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-border">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight">Editorial Moderation Queue</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              Admin Verified
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Review community submissions, manage discoveries, and curate original prompt recipes for the Tech Hacks AI catalog.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => token && loadQueue(token)}
            disabled={isLoading}
            className="p-2 rounded-xl bg-card border border-border hover:bg-muted text-foreground transition-colors flex items-center gap-2 text-sm px-3"
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
            <span>Refresh</span>
          </button>

          <button
            onClick={handleSignOut}
            className="p-2 rounded-xl bg-card border border-border hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 text-muted-foreground transition-colors flex items-center gap-2 text-sm px-3"
            title="Lock session"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Lock</span>
          </button>
        </div>
      </div>

      {/* Admin Section Tabs */}
      <div className="flex items-center gap-2 mt-6 mb-8 border-b border-border/80 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveAdminTab('submissions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'submissions'
              ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Community Submissions</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-background/30">
            {stats.pending > 0 ? `${stats.pending} pending` : stats.total}
          </span>
        </button>

        <button
          onClick={() => setActiveAdminTab('discoveries')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'discoveries'
              ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
          }`}
        >
          <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Daily Discoveries &amp; Featured Tools</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('prompts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'prompts'
              ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Zm0 13.5A2.5 2.5 0 0 1 6.5 16H20M8 7h8M8 10h6" />
          </svg>
          <span>Prompt Library</span>
        </button>
      </div>

      {activeAdminTab === 'discoveries' ? (
        <AdminDiscoveriesManager token={token} />
      ) : activeAdminTab === 'prompts' ? (
        <AdminPromptManager token={token} />
      ) : (
        <>
          {/* Metrics Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 my-6">
        <div
          onClick={() => setFilterStatus('all')}
          className={`cursor-pointer p-4 rounded-xl border bg-card/60 transition-all ${
            filterStatus === 'all' ? 'border-primary ring-1 ring-primary/40' : 'border-border hover:border-border/80'
          }`}
        >
          <div className="text-xs text-muted-foreground font-semibold">Total Submissions</div>
          <div className="text-2xl font-bold mt-1 text-foreground">{stats.total}</div>
        </div>

        <div
          onClick={() => setFilterStatus('pending')}
          className={`cursor-pointer p-4 rounded-xl border bg-card/60 transition-all ${
            filterStatus === 'pending' ? 'border-amber-500 ring-1 ring-amber-500/40' : 'border-border hover:border-border/80'
          }`}
        >
          <div className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Pending Review
          </div>
          <div className="text-2xl font-bold mt-1 text-amber-400">{stats.pending}</div>
        </div>

        <div
          onClick={() => setFilterStatus('in_review')}
          className={`cursor-pointer p-4 rounded-xl border bg-card/60 transition-all ${
            filterStatus === 'in_review' ? 'border-blue-500 ring-1 ring-blue-500/40' : 'border-border hover:border-border/80'
          }`}
        >
          <div className="text-xs text-blue-400 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            In Review
          </div>
          <div className="text-2xl font-bold mt-1 text-blue-400">{stats.inReview}</div>
        </div>

        <div
          onClick={() => setFilterStatus('published')}
          className={`cursor-pointer p-4 rounded-xl border bg-card/60 transition-all ${
            filterStatus === 'published' ? 'border-emerald-500 ring-1 ring-emerald-500/40' : 'border-border hover:border-border/80'
          }`}
        >
          <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Published Live
          </div>
          <div className="text-2xl font-bold mt-1 text-emerald-400">{stats.approved}</div>
        </div>

        <div
          onClick={() => setFilterStatus('rejected')}
          className={`cursor-pointer p-4 rounded-xl border bg-card/60 transition-all ${
            filterStatus === 'rejected' ? 'border-rose-500 ring-1 ring-rose-500/40' : 'border-border hover:border-border/80'
          }`}
        >
          <div className="text-xs text-rose-400 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            Rejected
          </div>
          <div className="text-2xl font-bold mt-1 text-rose-400">{stats.rejected}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-4 rounded-2xl bg-card/50 border border-border mb-6">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Type Filter */}
          <div className="flex p-1 rounded-xl bg-background border border-border">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterType === 'all'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setFilterType('tool')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterType === 'tool'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              AI Tools
            </button>
            <button
              onClick={() => setFilterType('guide')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterType === 'guide'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Guides
            </button>
          </div>

          {/* Status Dropdown */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-background border border-border text-foreground text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
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
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-background border border-border text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <svg
            className="w-4 h-4 absolute left-3 top-2 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {fetchError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm mb-6 flex items-center justify-between">
          <span>{fetchError}</span>
          <button
            onClick={() => token && loadQueue(token)}
            className="underline hover:no-underline text-xs"
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
            <div className="text-center py-16 bg-card/30 border border-dashed border-border rounded-2xl p-8">
              <svg className="w-12 h-12 mx-auto text-muted-foreground/60 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-base font-semibold text-foreground">No submissions found</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                No items match your selected filters. Submissions submitted from <code className="bg-muted px-1 rounded">/submit-tool</code> or <code className="bg-muted px-1 rounded">/submit-guide</code> will appear here.
              </p>
            </div>
          ) : (
            filteredSubmissions.map((sub) => {
              const isSelected = selectedSubmission?.id === sub.id;
              const title = sub.type === 'tool' ? sub.toolData?.name : sub.guideData?.title;
              const summary = sub.type === 'tool' ? sub.toolData?.description : sub.guideData?.summary;
              const author = sub.type === 'tool' ? sub.toolData?.submitterName : sub.guideData?.authorName;
              const dateStr = new Date(sub.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={sub.id}
                  onClick={() => setSelectedSubmission(sub)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-card border-primary ring-2 ring-primary/20 shadow-lg'
                      : 'bg-card/60 border-border hover:border-border/80 hover:bg-card'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          sub.type === 'tool'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20'
                            : 'bg-purple-50 text-purple-800 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/20'
                        }`}
                      >
                        {sub.type === 'tool' ? 'AI Tool' : 'Guide'}
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                          sub.status
                        )}`}
                      >
                        {sub.status.replace('_', ' ')}
                      </span>
                    </div>

                    <span className="text-[11px] text-muted-foreground">{dateStr}</span>
                  </div>

                  <h3 className="text-base font-bold text-foreground line-clamp-1">{title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{summary}</p>

                  {/* Duplicate warning tag if present */}
                  {sub.potentialDuplicate && (
                    <div className="mt-2.5 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="truncate">Duplicate match flagged</span>
                    </div>
                  )}

                  <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="truncate">
                      By <strong className="text-foreground font-medium">{author || 'Community Contributor'}</strong>
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground/80">{sub.id}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Detailed Review & Edit Panel */}
        {selectedSubmission && (
          <div className="lg:col-span-7 bg-card border border-border rounded-2xl p-6 shadow-xl relative space-y-6">
            {/* Drawer Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      selectedSubmission.type === 'tool'
                        ? 'bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20'
                        : 'bg-purple-50 text-purple-800 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/20'
                    }`}
                  >
                    {selectedSubmission.type === 'tool' ? 'AI Tool Submission' : 'Guide Submission'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                      selectedSubmission.status
                    )}`}
                  >
                    {selectedSubmission.status.replace('_', ' ')}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-foreground">
                  {selectedSubmission.type === 'tool'
                    ? selectedSubmission.toolData?.name
                    : selectedSubmission.guideData?.title}
                </h2>
                <div className="text-xs text-muted-foreground mt-0.5">
                  ID: <code className="font-mono">{selectedSubmission.id}</code> · Received{' '}
                  {new Date(selectedSubmission.createdAt).toLocaleString()}
                </div>
              </div>

              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                title="Close drawer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Error Message */}
            {actionError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{actionError}</span>
              </div>
            )}

            {/* Potential Duplicate Banner */}
            {selectedSubmission.potentialDuplicate && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1">
                <div className="font-bold flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Potential Catalog Duplicate Detected</span>
                </div>
                <p className="text-amber-200/90 pl-6">
                  {selectedSubmission.duplicateReason ||
                    'A tool with a matching name or domain already exists in the catalog.'}
                </p>
              </div>
            )}

            {/* Submitter Attribution Box */}
            <div className="p-4 rounded-xl bg-muted/30 border border-border text-xs grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-muted-foreground block text-[11px]">Submitted By</span>
                <span className="font-semibold text-foreground">
                  {selectedSubmission.type === 'tool'
                    ? selectedSubmission.toolData?.submitterName || 'Community Contributor'
                    : selectedSubmission.guideData?.authorName || 'Community Contributor'}
                </span>
                {(selectedSubmission.type === 'tool'
                  ? selectedSubmission.toolData?.submitterEmail
                  : selectedSubmission.guideData?.contactEmail) && (
                  <span className="text-muted-foreground block">
                    {selectedSubmission.type === 'tool'
                      ? selectedSubmission.toolData?.submitterEmail
                      : selectedSubmission.guideData?.contactEmail}
                  </span>
                )}
              </div>

              <div>
                <span className="text-muted-foreground block text-[11px]">Affiliation & Links</span>
                <span className="text-foreground">
                  {selectedSubmission.type === 'tool'
                    ? selectedSubmission.toolData?.notes || 'Community Contributor'
                    : selectedSubmission.guideData?.difficulty || 'Community Contributor'}
                  {selectedSubmission.type === 'tool' && selectedSubmission.toolData?.alternativeTo && (
                    <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary border border-primary/20">
                      Alternative to {selectedSubmission.toolData.alternativeTo}
                    </span>
                  )}
                </span>
                {selectedSubmission.type === 'tool' && selectedSubmission.toolData?.platform?.length ? (
                  <span className="text-muted-foreground block truncate">
                    Platforms: {selectedSubmission.toolData.platform.join(', ')}
                  </span>
                ) : null}
              </div>
            </div>

            {/* Official Link Out */}
            {selectedSubmission.type === 'tool' && (
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={selectedSubmission.toolData?.websiteUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 text-xs font-semibold transition-colors"
                >
                  <span>Visit Official Website</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>

              </div>
            )}

            {/* Guide Content Markdown Preview */}
            {selectedSubmission.type === 'guide' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Submitted Guide Article Content
                  </label>
                  <span className="text-xs text-muted-foreground">
                    {selectedSubmission.guideData?.readTime || '5 min read'}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-background border border-border max-h-72 overflow-y-auto text-sm">
                  <SafeMarkdown content={selectedSubmission.guideData?.content || ''} />
                </div>
              </div>
            )}

            {/* Editorial Correction Fields */}
            <div className="space-y-4 pt-2 border-t border-border">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Editorial Review & Corrections
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Display Name / Title
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-foreground text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-foreground text-xs"
                  />
                </div>

                {selectedSubmission.type === 'tool' && (
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Pricing Model
                    </label>
                    <select
                      value={editPricingType}
                      onChange={(e) => setEditPricingType(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-foreground text-xs"
                    >
                      <option value="free">Free</option>
                      <option value="freemium">Freemium</option>
                      <option value="open-source">Open Source</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Published Slug (Optional custom slug)
                  </label>
                  <input
                    type="text"
                    value={editSlug}
                    onChange={(e) => setEditSlug(e.target.value)}
                    placeholder="e.g. jan-ai"
                    className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-foreground text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Summary / Short Description
                </label>
                <textarea
                  rows={2}
                  value={editSummary}
                  onChange={(e) => setEditSummary(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-foreground text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-foreground text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Internal Editorial Review Notes
                </label>
                <textarea
                  rows={2}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Notes on verified pricing, test results, reasons for rejection or publication..."
                  className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-foreground text-xs"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveEdits}
                  disabled={isProcessingAction}
                  className="px-3 py-1.5 rounded-lg bg-card border border-border hover:bg-muted text-xs font-semibold text-foreground transition-colors disabled:opacity-50"
                >
                  Save Editorial Edits
                </button>
              </div>
            </div>

            {/* Moderation Workflow Actions */}
            <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange('in_review')}
                  disabled={isProcessingAction || selectedSubmission.status === 'in_review'}
                  className="px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 text-xs font-semibold transition-colors disabled:opacity-40"
                >
                  Mark In Review
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange('rejected')}
                  disabled={isProcessingAction || selectedSubmission.status === 'rejected'}
                  className="px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold transition-colors disabled:opacity-40"
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
                  className="px-3 py-2 rounded-xl bg-muted border border-border hover:bg-muted/80 text-foreground text-xs font-semibold transition-colors disabled:opacity-40"
                >
                  Mark Approved
                </button>
              </div>

              <div>
                {selectedSubmission.status === 'published' ? (
                  <a
                    href={
                      selectedSubmission.type === 'tool'
                        ? `/ai-tools/${selectedSubmission.publishedSlug || ''}`
                        : `/guides/${selectedSubmission.publishedSlug || ''}`
                    }
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-colors"
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
                    disabled={isProcessingAction || selectedSubmission.status !== 'approved'}
                    title={selectedSubmission.status === 'approved' ? 'Publish this approved submission' : 'Mark the submission approved before publishing'}
                    className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs transition-colors shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
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
