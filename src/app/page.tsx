'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Job, JobStatus, FilterState } from '@/types/job';
import { fetchJobs, saveJob, removeJob } from '@/lib/jobService';
import { Header } from '@/components/Header';
import { StatsCards } from '@/components/StatsCards';
import { FilterPanel } from '@/components/FilterPanel';
import { JobTable } from '@/components/JobTable';
import { JobDrawer } from '@/components/JobDrawer';
import { LoginScreen } from '@/components/LoginScreen';
import { Search, ArrowUpDown, Trash2, CheckSquare } from 'lucide-react';

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [sortOption, setSortOption] = useState<string>('Newest');

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: [],
    workMode: [],
    platform: [],
    experience: [],
    minSalary: 0,
    favoriteOnly: false,
    recentlyAddedOnly: false
  });

  // ponytail: load jobs on mount or authentication change
  const loadData = async (username: string) => {
    setRefreshing(true);
    const data = await fetchJobs(username);
    setJobs(data);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setCurrentUser(storedUser);
        loadData(storedUser);
      } else {
        setLoading(false);
      }
      setCheckingAuth(false);
    }
  }, []);

  const handleLoginSuccess = (username: string) => {
    localStorage.setItem('currentUser', username);
    setCurrentUser(username);
    setLoading(true);
    loadData(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setJobs([]);
    setSelectedIds([]);
    setSelectedJob(null);
  };

  const handleUpdateStatus = async (job: Job, newStatus: JobStatus) => {
    if (!currentUser) return;
    // Prevent duplicate status logging
    const isAlreadyUsed = job.status === newStatus || (job.history || []).some(h => h.newStatus === newStatus);
    if (isAlreadyUsed) return;

    const updated: Job = {
      ...job,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      history: [
        ...(job.history || []),
        { previousStatus: job.status, newStatus, changedAt: new Date().toLocaleDateString(), changedBy: 'User' }
      ]
    };
    setJobs(prev => prev.map(j => j.id === job.id ? updated : j));
    if (selectedJob?.id === job.id) setSelectedJob(updated);
    saveJob(updated, currentUser);
  };

  const handleToggleFavorite = async (job: Job) => {
    if (!currentUser) return;
    const updated = { ...job, favorite: !job.favorite };
    setJobs(prev => prev.map(j => j.id === job.id ? updated : j));
    if (selectedJob?.id === job.id) setSelectedJob(updated);
    saveJob(updated, currentUser);
  };

  const handleDeleteJob = async (id: string) => {
    if (!currentUser) return;
    if (!confirm('Delete this opportunity?')) return;
    setJobs(prev => prev.filter(j => j.id !== id));
    setSelectedIds(prev => prev.filter(i => i !== id));
    if (selectedJob?.id === id) setSelectedJob(null);
    removeJob(id, currentUser);
  };

  // Bulk Actions
  const handleBulkStatus = async (status: JobStatus) => {
    if (!currentUser) return;
    for (const id of selectedIds) {
      const j = jobs.find(x => x.id === id);
      if (j) await handleUpdateStatus(j, status);
    }
    setSelectedIds([]);
  };

  const handleBulkDelete = async () => {
    if (!currentUser) return;
    if (!confirm(`Delete ${selectedIds.length} selected opportunities?`)) return;
    for (const id of selectedIds) {
      await removeJob(id, currentUser);
    }
    setJobs(prev => prev.filter(j => !selectedIds.includes(j.id)));
    setSelectedIds([]);
  };

  // Filter + Sort Pipeline
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Search across multi attributes
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const match =
          job.title.toLowerCase().includes(q) ||
          job.company.toLowerCase().includes(q) ||
          job.location.toLowerCase().includes(q) ||
          (job.notes && job.notes.toLowerCase().includes(q)) ||
          job.tags.some(t => t.toLowerCase().includes(q));
        if (!match) return false;
      }
      if (filters.status.length && !filters.status.includes(job.status)) return false;
      if (filters.workMode.length && !filters.workMode.includes(job.workMode)) return false;
      if (filters.platform.length && !filters.platform.includes(job.platform)) return false;
      if (filters.experience.length && (!job.experience || !filters.experience.includes(job.experience))) return false;
      if (filters.minSalary > 0 && job.salaryMin < filters.minSalary) return false;
      if (filters.favoriteOnly && !job.favorite) return false;
      return true;
    }).sort((a, b) => {
      switch (sortOption) {
        case 'Newest': return (b.datePosted || '').localeCompare(a.datePosted || '');
        case 'Oldest': return (a.datePosted || '').localeCompare(b.datePosted || '');
        case 'Highest Salary': return b.salaryMin - a.salaryMin;
        case 'Lowest Salary': return a.salaryMin - b.salaryMin;
        case 'Company A-Z': return a.company.localeCompare(b.company);
        case 'Date Posted': return (b.datePosted || '').localeCompare(a.datePosted || '');
        default: return 0;
      }
    });
  }, [jobs, filters, sortOption]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-8 w-8 text-[#0071e3]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm font-medium text-[#707070]">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f7]">
      <Header currentUser={currentUser} onLogout={handleLogout} />

      <main className="max-w-[1440px] w-full mx-auto px-4 sm:px-8 py-6 flex-1 flex flex-col">
        {/* Stats Section */}
        <StatsCards jobs={jobs} />

        {/* Action Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-[8px] border border-[#d2d2d7] shadow-2xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#858585] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, company, skills, tags, notes..."
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 rounded-[8px] bg-[#f5f5f7] border border-[#d2d2d7] text-sm text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="w-4 h-4 text-[#707070]" />
            <select
              value={sortOption}
              onChange={e => setSortOption(e.target.value)}
              className="py-2 px-3 rounded-[8px] bg-[#f5f5f7] border border-[#d2d2d7] text-xs font-medium text-[#1d1d1f] cursor-pointer"
            >
              <option value="Newest">Sort: Newest</option>
              <option value="Oldest">Sort: Oldest</option>
              <option value="Highest Salary">Sort: Highest Salary</option>
              <option value="Lowest Salary">Sort: Lowest Salary</option>
              <option value="Company A-Z">Sort: Company A-Z</option>
              <option value="Date Posted">Sort: Date Posted</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions Banner */}
        {selectedIds.length > 0 && (
          <div className="bg-[#1d1d1f] text-white p-3 px-5 rounded-[8px] mb-6 flex flex-wrap items-center justify-between gap-4 shadow-xl animate-fade-in">
            <div className="flex items-center gap-2 text-sm font-medium">
              <CheckSquare className="w-4 h-4 text-[#0071e3]" />
              <span>{selectedIds.length} opportunity selected</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <select
                onChange={e => { if (e.target.value) handleBulkStatus(e.target.value as any); }}
                className="bg-[#333333] border border-[#474747] text-white px-3 py-1.5 rounded-[980px] cursor-pointer"
              >
                <option value="">Move Status To...</option>
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
                <option value="Not Valid">Not Valid</option>
              </select>
              <button onClick={handleBulkDelete} className="flex items-center gap-1 px-3 py-1.5 rounded-[980px] bg-rose-600 hover:bg-rose-700 text-white">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        )}

        {/* Main Workspace Layout */}
        <div className="flex flex-col md:flex-row gap-6 items-start flex-1">
          <FilterPanel filters={filters} onChange={setFilters} />

          {loading ? (
            <div className="flex-1 bg-white p-12 rounded-[8px] border border-[#d2d2d7] flex flex-col gap-4 animate-pulse">
              <div className="h-10 bg-[#f5f5f7] rounded w-full" />
              <div className="h-16 bg-[#f5f5f7] rounded w-full" />
              <div className="h-16 bg-[#f5f5f7] rounded w-full" />
            </div>
          ) : (
            <JobTable
              jobs={filteredJobs}
              selectedIds={selectedIds}
              onSelectToggle={id => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])}
              onSelectAll={ids => setSelectedIds(ids)}
              onSelectJob={job => setSelectedJob(job)}
              onUpdateStatus={handleUpdateStatus}
              onToggleFavorite={handleToggleFavorite}
              onDeleteJob={handleDeleteJob}
            />
          )}
        </div>
      </main>

      {/* Drawers & Modals */}
      <JobDrawer
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onSave={async updated => {
          if (!currentUser) return;
          await saveJob(updated, currentUser);
          setJobs(prev => prev.map(j => j.id === updated.id ? updated : j));
          setSelectedJob(updated);
        }}
      />
    </div>
  );
}
