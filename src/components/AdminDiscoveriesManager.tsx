import React, { useState, useEffect, useMemo } from 'react';
import type { ToolDiscovery, DiscoveryFormData } from '../types/discoveries';
import {
  fetchAdminDiscoveries,
  createDiscovery,
  updateDiscovery,
  deleteDiscovery,
  toggleDiscoveryStatus,
  toggleDiscoveryFeatured,
  sanitizeOutboundUrl,
} from '../services/discoveryService';
import {
  Sparkles,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  Star,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Eye,
  EyeOff,
  Filter,
} from 'lucide-react';

interface AdminDiscoveriesManagerProps {
  token: string;
}

export const AdminDiscoveriesManager: React.FC<AdminDiscoveriesManagerProps> = ({ token }) => {
  const [discoveries, setDiscoveries] = useState<ToolDiscovery[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formWebsiteUrl, setFormWebsiteUrl] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formCategory, setFormCategory] = useState('Developer Tools');
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsNew, setFormIsNew] = useState(true);
  const [formStatus, setFormStatus] = useState<'draft' | 'published'>('published');

  // Delete confirmation
  const [deleteCandidate, setDeleteCandidate] = useState<ToolDiscovery | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const loadDiscoveries = async () => {
    setIsLoading(true);
    setFetchError(null);
    const result = await fetchAdminDiscoveries(token);
    setIsLoading(false);

    if (result.success) {
      setDiscoveries(result.discoveries);
    } else {
      setFetchError(result.error || 'Failed to fetch discoveries.');
    }
  };

  useEffect(() => {
    if (token) {
      loadDiscoveries();
    }
  }, [token]);

  // Filtered discoveries
  const filteredList = useMemo(() => {
    return discoveries.filter((d) => {
      if (statusFilter !== 'all' && d.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = d.name.toLowerCase().includes(q);
        const matchDesc = d.description.toLowerCase().includes(q);
        const matchCat = (d.category || '').toLowerCase().includes(q);
        return matchName || matchDesc || matchCat;
      }
      return true;
    });
  }, [discoveries, statusFilter, searchQuery]);

  // Metrics
  const stats = useMemo(() => {
    const total = discoveries.length;
    const published = discoveries.filter((d) => d.status === 'published').length;
    const drafts = discoveries.filter((d) => d.status === 'draft').length;
    const featured = discoveries.filter((d) => d.isFeatured).length;
    return { total, published, drafts, featured };
  }, [discoveries]);

  // Open modal for Create
  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormName('');
    setFormDescription('');
    setFormWebsiteUrl('');
    setFormImageUrl('');
    setFormCategory('Developer Tools');
    setFormIsFeatured(false);
    setFormIsNew(true);
    setFormStatus('published');
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (discovery: ToolDiscovery) => {
    setEditingId(discovery.id);
    setFormName(discovery.name);
    setFormDescription(discovery.description);
    setFormWebsiteUrl(discovery.websiteUrl);
    setFormImageUrl(discovery.imageUrl || '');
    setFormCategory(discovery.category || 'Developer Tools');
    setFormIsFeatured(Boolean(discovery.isFeatured));
    setFormIsNew(Boolean(discovery.isNew));
    setFormStatus(discovery.status);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Form Submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!formName.trim() || formName.trim().length < 2) {
      setFormError('Tool name is required (minimum 2 characters).');
      return;
    }
    if (!formDescription.trim() || formDescription.trim().length < 10) {
      setFormError('Short description is required (minimum 10 characters).');
      return;
    }
    if (!formWebsiteUrl.trim()) {
      setFormError('Website URL is required.');
      return;
    }

    const safeUrl = sanitizeOutboundUrl(formWebsiteUrl);
    if (!safeUrl) {
      setFormError('Please enter a valid HTTP or HTTPS website URL. Unsafe protocols (e.g. javascript:) are not allowed.');
      return;
    }

    if (formImageUrl.trim()) {
      const safeImg = sanitizeOutboundUrl(formImageUrl);
      if (!safeImg) {
        setFormError('Image/logo URL must be a valid HTTP or HTTPS web address.');
        return;
      }
    }

    const payload: DiscoveryFormData = {
      name: formName.trim(),
      description: formDescription.trim(),
      websiteUrl: safeUrl,
      imageUrl: formImageUrl.trim() ? sanitizeOutboundUrl(formImageUrl) : undefined,
      category: formCategory.trim() || 'General',
      isFeatured: formIsFeatured,
      isNew: formIsNew,
      status: formStatus,
    };

    setIsSaving(true);
    if (editingId) {
      const result = await updateDiscovery(editingId, payload, token);
      setIsSaving(false);
      if (result.success) {
        setToastMessage(`Discovery "${payload.name}" updated successfully.`);
        setIsModalOpen(false);
        loadDiscoveries();
      } else {
        setFormError(result.error || 'Failed to update discovery.');
      }
    } else {
      const result = await createDiscovery(payload, token);
      setIsSaving(false);
      if (result.success) {
        setToastMessage(`Discovery "${payload.name}" created successfully.`);
        setIsModalOpen(false);
        loadDiscoveries();
      } else {
        setFormError(result.error || 'Failed to create discovery.');
      }
    }
  };

  // Quick 1-click status toggle
  const handleToggleStatus = async (discovery: ToolDiscovery) => {
    const newStatus = discovery.status === 'published' ? 'draft' : 'published';
    const result = await toggleDiscoveryStatus(discovery.id, discovery.status, token);
    if (result.success) {
      setToastMessage(`"${discovery.name}" changed to ${newStatus}.`);
      setDiscoveries((prev) =>
        prev.map((d) => (d.id === discovery.id ? { ...d, status: newStatus } : d))
      );
    } else {
      alert(result.error || 'Failed to toggle status.');
    }
  };

  // Quick 1-click featured toggle
  const handleToggleFeatured = async (discovery: ToolDiscovery) => {
    const result = await toggleDiscoveryFeatured(discovery.id, Boolean(discovery.isFeatured), token);
    if (result.success) {
      const isNowFeatured = !discovery.isFeatured;
      setToastMessage(`"${discovery.name}" is ${isNowFeatured ? 'now featured' : 'no longer featured'}.`);
      setDiscoveries((prev) =>
        prev.map((d) => (d.id === discovery.id ? { ...d, isFeatured: isNowFeatured } : d))
      );
    } else {
      alert(result.error || 'Failed to toggle featured status.');
    }
  };

  // Delete Execution
  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;
    const result = await deleteDiscovery(deleteCandidate.id, token);
    if (result.success) {
      setToastMessage(`Discovery "${deleteCandidate.name}" deleted.`);
      setDiscoveries((prev) => prev.filter((d) => d.id !== deleteCandidate.id));
      setDeleteCandidate(null);
    } else {
      alert(result.error || 'Failed to delete discovery.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-card border border-emerald-500/40 text-emerald-400 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setStatusFilter('all')}
          className={`cursor-pointer p-4 rounded-xl border bg-card/60 transition-all ${
            statusFilter === 'all' ? 'border-primary ring-1 ring-primary/40' : 'border-border hover:border-border/80'
          }`}
        >
          <div className="text-xs text-muted-foreground font-semibold">Total Discoveries</div>
          <div className="text-2xl font-bold mt-1 text-foreground">{stats.total}</div>
        </div>

        <div
          onClick={() => setStatusFilter('published')}
          className={`cursor-pointer p-4 rounded-xl border bg-card/60 transition-all ${
            statusFilter === 'published' ? 'border-emerald-500 ring-1 ring-emerald-500/40' : 'border-border hover:border-border/80'
          }`}
        >
          <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Published (Live)
          </div>
          <div className="text-2xl font-bold mt-1 text-emerald-400">{stats.published}</div>
        </div>

        <div
          onClick={() => setStatusFilter('draft')}
          className={`cursor-pointer p-4 rounded-xl border bg-card/60 transition-all ${
            statusFilter === 'draft' ? 'border-amber-500 ring-1 ring-amber-500/40' : 'border-border hover:border-border/80'
          }`}
        >
          <div className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Drafts (Hidden)
          </div>
          <div className="text-2xl font-bold mt-1 text-amber-400">{stats.drafts}</div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card/60">
          <div className="text-xs text-purple-400 font-semibold flex items-center gap-1.5">
            <Star className="w-3 h-3 text-purple-400" />
            Featured Badges
          </div>
          <div className="text-2xl font-bold mt-1 text-purple-400">{stats.featured}</div>
        </div>
      </div>

      {/* Action / Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card/70 border border-border/80 rounded-xl p-3">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discoveries by name or category..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-1 border border-border/60 rounded-lg p-0.5 bg-background/50">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                statusFilter === 'all' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                statusFilter === 'published' ? 'bg-emerald-500 text-white' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                statusFilter === 'draft' ? 'bg-amber-500 text-white' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Drafts
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadDiscoveries}
            disabled={isLoading}
            className="p-2 rounded-xl bg-card border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 text-xs px-2.5"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover shadow transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Discovery</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {fetchError && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs flex items-center justify-between">
          <span>{fetchError}</span>
          <button onClick={loadDiscoveries} className="underline hover:text-rose-300">
            Retry
          </button>
        </div>
      )}

      {/* Discoveries List / Table */}
      {isLoading ? (
        <div className="p-12 text-center text-sm text-muted-foreground">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
          <span>Loading tool discoveries...</span>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="p-12 rounded-xl border border-border/80 bg-card/40 text-center">
          <p className="text-sm font-semibold text-foreground mb-1">No discoveries found</p>
          <p className="text-xs text-muted-foreground mb-4">
            {searchQuery || statusFilter !== 'all'
              ? 'No items matched your current search or status filter.'
              : 'You have not added any tool discoveries yet.'}
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Discovery</span>
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden bg-card/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-foreground">
              <thead className="bg-muted/60 text-muted-foreground border-b border-border text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Tool</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Badges</th>
                  <th className="py-3 px-3">Added Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredList.map((disc) => {
                  const safeUrl = sanitizeOutboundUrl(disc.websiteUrl);
                  const safeImg = disc.imageUrl ? sanitizeOutboundUrl(disc.imageUrl) : '';
                  return (
                    <tr key={disc.id} className="hover:bg-muted/30 transition-colors">
                      {/* Tool Name & Logo */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg border border-border bg-background p-0.5 flex-shrink-0 flex items-center justify-center overflow-hidden">
                            {safeImg ? (
                              <img src={safeImg} alt="" className="w-full h-full object-cover rounded" />
                            ) : (
                              <div className="w-full h-full bg-primary/20 text-primary font-bold flex items-center justify-center text-xs">
                                {disc.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <div className="font-bold text-foreground truncate">{disc.name}</div>
                            <div className="text-[11px] text-muted-foreground truncate max-w-[200px] sm:max-w-xs">
                              {disc.description}
                            </div>
                            {safeUrl && (
                              <a
                                href={safeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline mt-0.5"
                              >
                                <span>{new URL(safeUrl).hostname}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[11px] bg-muted text-muted-foreground border border-border/60">
                          {disc.category || 'General'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <button
                          onClick={() => handleToggleStatus(disc)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                            disc.status === 'published'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                          }`}
                          title={`Click to switch to ${disc.status === 'published' ? 'Draft' : 'Published'}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              disc.status === 'published' ? 'bg-emerald-400' : 'bg-amber-400'
                            }`}
                          />
                          <span className="capitalize">{disc.status}</span>
                        </button>
                      </td>

                      {/* Badges */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1 flex-wrap">
                          <button
                            onClick={() => handleToggleFeatured(disc)}
                            className={`p-1 rounded-md border transition-colors cursor-pointer ${
                              disc.isFeatured
                                ? 'bg-purple-500/20 border-purple-500/40 text-purple-400'
                                : 'bg-muted/40 border-border text-muted-foreground hover:text-foreground'
                            }`}
                            title={disc.isFeatured ? 'Featured (click to remove)' : 'Click to feature'}
                          >
                            <Star className={`w-3.5 h-3.5 ${disc.isFeatured ? 'fill-purple-400' : ''}`} />
                          </button>
                          {disc.isNew && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-primary/15 text-primary border border-primary/20 uppercase">
                              New
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3 text-muted-foreground text-[11px]">
                        {new Date(disc.createdAt).toLocaleDateString()}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleToggleStatus(disc)}
                            className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title={disc.status === 'published' ? 'Unpublish (make draft)' : 'Publish (make live)'}
                          >
                            {disc.status === 'published' ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            onClick={() => handleOpenEditModal(disc)}
                            className="p-1.5 rounded-lg border border-border hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-colors text-muted-foreground"
                            title="Edit discovery details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeleteCandidate(disc)}
                            className="p-1.5 rounded-lg border border-border hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 transition-colors text-muted-foreground"
                            title="Delete discovery"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {editingId ? 'Edit Tool Discovery' : 'Add New Daily Discovery'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs mb-4 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Tool Name */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Tool Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Cursor, Perplexity AI, ElevenLabs"
                  className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Short Description <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Explain why this tool is groundbreaking, what problems it solves, and why editors recommend it..."
                  className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <span className="text-[10px] text-muted-foreground block text-right mt-1">
                  {formDescription.length}/600 chars
                </span>
              </div>

              {/* Website URL */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Official Website URL <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formWebsiteUrl}
                  onChange={(e) => setFormWebsiteUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Image / Logo URL */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Tool Logo or Cover Image URL <span className="text-muted-foreground">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://.../logo.png or Unsplash image URL"
                  className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {formImageUrl && sanitizeOutboundUrl(formImageUrl) && (
                  <div className="mt-2 flex items-center gap-2 p-2 rounded-lg border border-border/60 bg-muted/30">
                    <img
                      src={sanitizeOutboundUrl(formImageUrl)}
                      alt="Preview"
                      className="w-8 h-8 rounded object-cover border border-border"
                      onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                    />
                    <span className="text-[11px] text-muted-foreground">Image preview valid</span>
                  </div>
                )}
              </div>

              {/* Category & Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option value="Developer Tools">Developer Tools</option>
                    <option value="Search & Research">Search & Research</option>
                    <option value="Audio & Speech">Audio & Speech</option>
                    <option value="Design & Image">Design & Image</option>
                    <option value="Video Generation">Video Generation</option>
                    <option value="Large Language Models">Large Language Models</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Automation & Agents">Automation & Agents</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Publication Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option value="published">Published (Visible on site)</option>
                    <option value="draft">Draft (Hidden from public)</option>
                  </select>
                </div>
              </div>

              {/* Badges Toggles */}
              <div className="pt-2 border-t border-border/60 flex items-center gap-6">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary bg-background border-border"
                  />
                  <span className="text-xs text-foreground font-medium flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-purple-400" />
                    <span>Featured in Highlights</span>
                  </span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsNew}
                    onChange={(e) => setFormIsNew(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary bg-background border-border"
                  />
                  <span className="text-xs text-foreground font-medium flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span>Display "New" Badge</span>
                  </span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-border/60 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl border border-border text-muted-foreground hover:text-foreground text-xs font-semibold hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover shadow transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSaving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingId ? 'Save Changes' : 'Create Discovery'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Confirm Deletion</h3>
                <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-secondary-foreground leading-relaxed my-4">
              Are you sure you want to permanently delete the tool discovery{' '}
              <strong className="text-foreground">"{deleteCandidate.name}"</strong>?
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 rounded-xl border border-border text-muted-foreground hover:text-foreground text-xs font-semibold hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 transition-colors shadow"
              >
                Delete Discovery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
