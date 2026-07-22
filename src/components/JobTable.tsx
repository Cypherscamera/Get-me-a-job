import React from 'react';
import { Job, JobStatus, PriorityLevel } from '@/types/job';
import { Star, ExternalLink, Trash2, Edit3, Copy, Building2, MapPin } from 'lucide-react';

interface JobTableProps {
  jobs: Job[];
  selectedIds: string[];
  onSelectToggle: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onSelectJob: (job: Job) => void;
  onUpdateStatus: (job: Job, status: JobStatus) => void;
  onToggleFavorite: (job: Job) => void;
  onDeleteJob: (id: string) => void;
}

const ALL_STATUSES: JobStatus[] = [
  'New', 'Applied', 'Not Applied', 'Rejected', 'Interview', 'Offer', 'Accepted', 'Not Valid'
];

export const JobTable: React.FC<JobTableProps> = ({
  jobs, selectedIds, onSelectToggle, onSelectAll, onSelectJob, onUpdateStatus, onToggleFavorite, onDeleteJob
}) => {
  const allSelected = jobs.length > 0 && selectedIds.length === jobs.length;

  const handleSelectAll = (checked: boolean) => {
    onSelectAll(checked ? jobs.map(j => j.id) : []);
  };

  const copyLink = (e: React.MouseEvent, job: Job) => {
    e.stopPropagation();
    const url = job.jobUrl || window.location.href;
    navigator.clipboard.writeText(url);
    alert('Copied link to clipboard!');
  };

  const priorityColor = (p: PriorityLevel) => {
    switch (p) {
      case 'High': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Low': return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const statusColor = (st: JobStatus) => {
    if (st === 'Offer' || st === 'Accepted') return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (st === 'Rejected' || st === 'Not Applied' || st === 'Not Valid') return 'bg-gray-100 text-gray-600 border-gray-300';
    if (st === 'Interview') return 'bg-purple-100 text-purple-800 border-purple-300';
    if (st === 'Applied') return 'bg-[#f4f8fb] text-[#0071e3] border-[#0071e3]/30';
    return 'bg-amber-50 text-amber-800 border-amber-200';
  };

  if (jobs.length === 0) {
    return (
      <div className="flex-1 bg-white rounded-[8px] border border-[#d2d2d7] p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-[#f4f8fb] flex items-center justify-center mb-4 text-[#0071e3]">
          <Building2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold text-[#1d1d1f]">No opportunities found</h3>
        <p className="text-sm text-[#707070] mt-1 max-w-md">
          Adjust your filters or add manual opportunities to expand your AI job pipeline.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0 flex flex-col gap-4">
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-[8px] border border-[#d2d2d7] overflow-x-auto shadow-2xs">
        <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1100px]">
          <thead>
            <tr className="bg-[#f5f5f7] border-b border-[#d2d2d7] text-xs font-semibold text-[#707070] uppercase tracking-wider">
              <th className="p-3.5 w-10 text-center">
                <input type="checkbox" checked={allSelected} onChange={e => handleSelectAll(e.target.checked)} className="rounded border-[#d2d2d7] text-[#0071e3] focus:ring-[#0071e3]" />
              </th>
              <th className="p-3.5 w-10">Fav</th>
              <th className="p-3.5">Role</th>
              <th className="p-3.5">Company</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Salary</th>
              <th className="p-3.5">Experience</th>
              <th className="p-3.5">Location</th>
              <th className="p-3.5">Work Mode</th>
              <th className="p-3.5">Platform</th>
              <th className="p-3.5">Date Posted</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e2e5] text-sm text-[#1d1d1f]">
            {jobs.map(job => (
              <tr
                key={job.id}
                onClick={() => onSelectJob(job)}
                className="hover:bg-[#f4f8fb]/50 cursor-pointer transition-colors group"
              >
                <td className="p-3.5 text-center" onClick={e => e.stopPropagation()}>
                  <input type="checkbox" checked={selectedIds.includes(job.id)} onChange={() => onSelectToggle(job.id)} className="rounded border-[#d2d2d7] text-[#0071e3] focus:ring-[#0071e3]" />
                </td>
                <td className="p-3.5" onClick={e => { e.stopPropagation(); onToggleFavorite(job); }}>
                  <Star className={`w-4 h-4 transition-colors ${job.favorite ? 'text-amber-500 fill-amber-500' : 'text-[#d2d2d7] hover:text-[#707070]'}`} />
                </td>
                <td className="p-3.5 font-semibold text-[#1d1d1f]">{job.title}</td>
                <td className="p-3.5 text-xs text-[#707070]">{job.company}</td>
                <td className="p-3.5 whitespace-nowrap">
                  <span className={`inline-block px-2.5 py-1 rounded-[980px] text-xs font-semibold border ${statusColor(job.status)}`}>
                    {job.status}
                  </span>
                </td>
                <td className="p-3.5 text-xs font-medium text-[#333333]">{job.salaryText}</td>
                <td className="p-3.5 text-xs text-[#707070]">{job.experience || 'N/A'}</td>
                <td className="p-3.5 text-xs text-[#707070]">{job.location}</td>
                <td className="p-3.5">
                  <span className="inline-block px-2 py-0.5 rounded-[980px] bg-[#f5f5f7] border border-[#e2e2e5] text-[10px] font-semibold uppercase text-[#707070] whitespace-nowrap">
                    {job.workMode}
                  </span>
                </td>
                <td className="p-3.5">
                  <span className="inline-block px-2.5 py-1 rounded-[980px] bg-[#f5f5f7] border border-[#d2d2d7] text-xs font-medium text-[#474747] whitespace-nowrap">
                    {job.platform}
                  </span>
                </td>
                <td className="p-3.5 text-xs text-[#707070]">{job.datePosted || 'N/A'}</td>
                <td className="p-3.5 text-right" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100">
                    <button onClick={e => copyLink(e, job)} className="p-1 hover:bg-[#e2e2e5] rounded text-[#707070] hover:text-[#1d1d1f]" title="Copy Link">
                      <Copy className="w-4 h-4" />
                    </button>
                    {job.jobUrl && (
                      <a href={job.jobUrl} target="_blank" rel="noreferrer" className="p-1 hover:bg-[#e2e2e5] rounded text-[#0066cc]" title="Open Job">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button onClick={() => onDeleteJob(job.id)} className="p-1 hover:bg-rose-50 rounded text-rose-600" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Cards View */}
      <div className="md:hidden flex flex-col gap-3">
        {jobs.map(job => (
          <div
            key={job.id}
            onClick={() => onSelectJob(job)}
            className="bg-white p-4 rounded-[8px] border border-[#d2d2d7] shadow-2xs flex flex-col gap-3 relative cursor-pointer active:scale-[0.99] transition-transform"
          >
            <div className="flex items-start justify-between">
              <div className="pr-8">
                <h4 className="font-semibold text-base text-[#1d1d1f]">{job.title}</h4>
                <p className="text-sm text-[#707070]">{job.company}</p>
              </div>
              <button
                onClick={e => { e.stopPropagation(); onToggleFavorite(job); }}
                className="absolute top-4 right-4 p-1"
              >
                <Star className={`w-5 h-5 ${job.favorite ? 'text-amber-500 fill-amber-500' : 'text-[#d2d2d7]'}`} />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-[980px] text-xs font-semibold border ${statusColor(job.status)}`}>
                {job.status}
              </span>
              <span className="px-2 py-0.5 rounded-[980px] bg-[#f5f5f7] border border-[#e2e2e5] text-xs text-[#707070]">
                {job.workMode}
              </span>
              {job.datePosted && (
                <span className="px-2 py-0.5 rounded-[980px] bg-[#f5f5f7] border border-[#e2e2e5] text-xs text-[#707070]">
                  📅 {job.datePosted}
                </span>
              )}
              {job.experience && (
                <span className="px-2 py-0.5 rounded-[980px] bg-[#f4f8fb] border border-[#0066cc]/30 text-xs text-[#0066cc]">
                  ⏱️ {job.experience}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-[#707070] pt-2 border-t border-[#f5f5f7]">
              <span>💰 {job.salaryText}</span>
              <span>📍 {job.location}</span>
              <span>🏷️ {job.platform}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
