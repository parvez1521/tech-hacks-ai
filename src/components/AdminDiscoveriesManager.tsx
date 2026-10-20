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
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-white border border-emerald-300 text-emerald-800 shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setStatusFilter('all')}
          className={`cursor-pointer p-4 rounded-xl border bg-white transition-all shadow-xs ${
            statusFilter === 'all' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-[#DFE7F3] hover:border-slate-300'
          }`}
        >
          <div className="text-xs text-slate-500 font-semibold tracking-wide">Total Discoveries</div>
          <div className="text-2xl font-bold mt-1 text-slate-900">{stats.total}</div>
        </div>

        <div
          onClick={() => setStatusFilter('published')}
          className={`cursor-pointer p-4 rounded-xl border bg-white transition-all shadow-xs ${
            statusFilter === 'published' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-[#DFE7F3] hover:border-slate-300'
          }`}
        >
          <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs" />
            Published (Live)
          </div>
          <div className="text-2xl font-bold mt-1 text-emerald-700">{stats.published}</div>
        </div>

        <div
          onClick={() => setStatusFilter('draft')}
          className={`cursor-pointer p-4 rounded-xl border bg-white transition-all shadow-xs ${
            statusFilter === 'draft' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-[#DFE7F3] hover:border-slate-300'
          }`}
        >
          <div className="text-xs text-amber-700 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 shadow-xs" />
            Drafts (Hidden)
          </div>
          <div className="text-2xl font-bold mt-1 text-amber-700">{stats.drafts}</div>
        </div>

        <div className="p-4 rounded-xl border border-[#DFE7F3] bg-white shadow-xs">
          <div className="text-xs text-purple-700 font-semibold flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-purple-600" />
            Featured Badges
          </div>
          <div className="text-2xl font-bold mt-1 text-purple-700">{stats.featured}</div>
        </div>
      </div>

      {/* Action / Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-[#DFE7F3] rounded-2xl p-3 shadow-xs">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discoveries by name or category..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#DFE7F3] bg-white text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1 border border-slate-200 rounded-xl p-0.5 bg-slate-100">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === 'published' ? 'bg-emerald-600 text-white shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === 'draft' ? 'bg-amber-600 text-white shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
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
            className="p-2 rounded-xl bg-white border border-[#DFE7F3] hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1.5 text-xs px-3 shadow-xs cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="font-medium">Refresh</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/25 transition-all active:scale-95 shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Discovery</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {fetchError && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs flex items-center justify-between">
          <span>{fetchError}</span>
          <button onClick={loadDiscoveries} className="underline hover:text-rose-800 font-semibold cursor-pointer">
            Retry
          </button>
        </div>
      )}

      {/* Discoveries List / Table */}
      {isLoading ? (
        <div className="p-12 text-center text-sm text-slate-500">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
          <span>Loading tool discoveries...</span>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="p-12 rounded-2xl border border-slate-300 bg-white text-center shadow-xs">
          <p className="text-sm font-semibold text-slate-900 mb-1">No discoveries found</p>
          <p className="text-xs text-slate-500 mb-4">
            {searchQuery || statusFilter !== 'all'
              ? 'No items matched your current search or status filter.'
              : 'You have not added any tool discoveries yet.'}
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Discovery</span>
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#DFE7F3] overflow-hidden bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 border-b border-[#DFE7F3] text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Tool</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Badges</th>
                  <th className="py-3 px-3">Added Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((disc) => {
                  const safeUrl = sanitizeOutboundUrl(disc.websiteUrl);
                  const safeImg = disc.imageUrl ? sanitizeOutboundUrl(disc.imageUrl) : '';
                  return (
                    <tr key={disc.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Tool Name & Logo */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg border border-slate-200 bg-slate-50 p-0.5 flex-shrink-0 flex items-center justify-center overflow-hidden">
                            {safeImg ? (
                              <img src={safeImg} alt="" className="w-full h-full object-cover rounded" />
                            ) : (
                              <div className="w-full h-full bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-xs">
                                {disc.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <div className="font-bold text-slate-900 truncate">{disc.name}</div>
                            <div className="text-[11px] text-slate-500 truncate max-w-[200px] sm:max-w-xs">
                              {disc.description}
                            </div>
                            {safeUrl && (
                              <a
                                href={safeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 hover:underline mt-0.5 font-medium"
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
                        <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-100 text-slate-700 border border-slate-200">
                          {disc.category || 'General'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <button
                          onClick={() => handleToggleStatus(disc)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                            disc.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                          }`}
                          title={`Click to switch to ${disc.status === 'published' ? 'Draft' : 'Published'}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              disc.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'
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
                                ? 'bg-purple-50 border-purple-200 text-purple-700'
                                : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700'
                            }`}
                            title={disc.isFeatured ? 'Featured (click to remove)' : 'Click to feature'}
                          >
                            <Star className={`w-3.5 h-3.5 ${disc.isFeatured ? 'fill-purple-600 text-purple-600' : ''}`} />
                          </button>
                          {disc.isNew && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                              New
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3 text-slate-500 text-[11px]">
                        {new Date(disc.createdAt).toLocaleDateString()}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleToggleStatus(disc)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
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
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors text-slate-500 cursor-pointer"
                            title="Edit discovery details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeleteCandidate(disc)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 transition-colors text-slate-500 cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl border border-[#DFE7F3] bg-white p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#DFE7F3] mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingId ? 'Edit Tool Discovery' : 'Add New Daily Discovery'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs mb-4 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Tool Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Tool Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Cursor, Perplexity AI, ElevenLabs"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DFE7F3] bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Short Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Explain why this tool is groundbreaking, what problems it solves, and why editors recommend it..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DFE7F3] bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                />
                <span className="text-[10px] text-slate-500 block text-right mt-1">
                  {formDescription.length}/600 chars
                </span>
              </div>

              {/* Website URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Official Website URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formWebsiteUrl}
                  onChange={(e) => setFormWebsiteUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DFE7F3] bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                />
              </div>

              {/* Image / Logo URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Tool Logo or Cover Image URL <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://.../logo.png or Unsplash image URL"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DFE7F3] bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                />
                {formImageUrl && sanitizeOutboundUrl(formImageUrl) && (
                  <div className="mt-2 flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-slate-50">
                    <img
                      src={sanitizeOutboundUrl(formImageUrl)}
                      alt="Preview"
                      className="w-8 h-8 rounded object-cover border border-slate-200"
                      onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                    />
                    <span className="text-[11px] text-slate-600">Image preview valid</span>
                  </div>
                )}
              </div>

              {/* Category & Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
                  <select
                    aria-label="Discovery category"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DFE7F3] bg-white text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Publication Status</label>
                  <select
                    aria-label="Publication status"
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DFE7F3] bg-white text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                  >
                    <option value="published">Published (Visible on site)</option>
                    <option value="draft">Draft (Hidden from public)</option>
                  </select>
                </div>
              </div>

              {/* Badges Toggles */}
              <div className="pt-2 border-t border-[#DFE7F3] flex items-center gap-6">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span className="text-xs text-slate-700 font-medium flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-purple-600" />
                    <span>Featured in Highlights</span>
                  </span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsNew}
                    onChange={(e) => setFormIsNew(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span className="text-xs text-slate-700 font-medium flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Display "New" Badge</span>
                  </span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-[#DFE7F3] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/25 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-[#DFE7F3] bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Confirm Deletion</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed my-4">
              Are you sure you want to permanently delete the tool discovery{' '}
              <strong className="text-slate-900 font-semibold">&quot;{deleteCandidate.name}&quot;</strong>?
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#DFE7F3]">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors shadow-md shadow-rose-600/20 cursor-pointer"
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
