import React, { useState, useEffect } from 'react';
import { Job, JobStatus } from '@/types/job';
import { X, ExternalLink, Mail, Tag, Plus, Clock, CheckCircle2, Trash2 } from 'lucide-react';

interface JobDrawerProps {
  job: Job | null;
  onClose: () => void;
  onSave: (updated: Job) => void;
}

const ALL_STATUSES: JobStatus[] = [
  'New', 'Applied', 'Not Applied', 'Rejected', 'Interview', 'Offer', 'Accepted', 'Not Valid'
];

export const JobDrawer: React.FC<JobDrawerProps> = ({ job, onClose, onSave }) => {
  const [notes, setNotes] = useState('');
  const [newTag, setNewTag] = useState('');
  const [stageStatus, setStageStatus] = useState<JobStatus>('Applied');
  const [stageDate, setStageDate] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (job) {
      setNotes(job.notes || '');
      const used = new Set<JobStatus>();
      if (job.status) used.add(job.status);
      if (job.history) {
        job.history.forEach(item => {
          if (item.newStatus) used.add(item.newStatus);
          if (item.previousStatus) used.add(item.previousStatus);
        });
      }
      const unused = ALL_STATUSES.find(st => !used.has(st)) || 'Applied';
      setStageStatus(unused);
    }
  }, [job]);

  if (!job) return null;

  // ponytail: handle autosave note blur
  const handleNotesBlur = () => {
    if (notes !== (job.notes || '')) {
      onSave({ ...job, notes });
    }
  };

  const handleAddStage = () => {
    if (!job) return;
    const formattedDate = new Date(stageDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const newHistory = [
      ...(job.history || []),
      { previousStatus: job.status, newStatus: stageStatus, changedAt: formattedDate, changedBy: 'User' }
    ];
    onSave({
      ...job,
      status: stageStatus,
      updatedAt: new Date().toISOString(),
      history: newHistory
    });
  };

  const handleRemoveStage = (idxToRemove: number) => {
    if (!job || !job.history) return;

    const itemToRemove = job.history[idxToRemove];
    const newHistory = [...job.history];

    if (idxToRemove < newHistory.length - 1) {
      newHistory[idxToRemove + 1] = {
        ...newHistory[idxToRemove + 1],
        previousStatus: itemToRemove.previousStatus
      };
    }

    newHistory.splice(idxToRemove, 1);

    let newStatus = job.status;
    if (itemToRemove.newStatus === job.status) {
      newStatus = itemToRemove.previousStatus;
    }

    onSave({
      ...job,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      history: newHistory
    });
  };

  const usedStatuses = new Set<JobStatus>();
  if (job.status) usedStatuses.add(job.status);
  if (job.history) {
    job.history.forEach(item => {
      if (item.newStatus) usedStatuses.add(item.newStatus);
      if (item.previousStatus) usedStatuses.add(item.previousStatus);
    });
  }

  const addTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && !job.tags.includes(newTag.trim())) {
      const nextTags = [...job.tags, newTag.trim()];
      onSave({ ...job, tags: nextTags });
      setNewTag('');
    }
  };

  const removeTag = (t: string) => {
    onSave({ ...job, tags: job.tags.filter(tag => tag !== t) });
  };

  const historyTimeline = job.history || [];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/30 backdrop-blur-xs flex justify-end animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col justify-between border-l border-[#d2d2d7]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#e2e2e5] flex items-start justify-between sticky top-0 bg-white/90 backdrop-blur-md z-10">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">{job.title}</h2>
            <div className="flex items-center gap-2 mt-1 text-sm text-[#707070]">
              <span className="font-medium text-[#1d1d1f]">{job.company}</span>
              <span>•</span>
              <span>{job.location} ({job.workMode})</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[#f5f5f7] text-[#707070] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-col flex gap-8 flex-1">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 bg-[#f5f5f7] p-4 rounded-[8px] border border-[#e2e2e5] text-sm">
            <div>
              <span className="text-xs text-[#707070] uppercase block font-semibold">Salary Range</span>
              <span className="font-medium text-[#1d1d1f]">{job.salaryText}</span>
            </div>
            <div>
              <span className="text-xs text-[#707070] uppercase block font-semibold">Platform Source</span>
              <span className="font-medium text-[#1d1d1f]">{job.platform}</span>
            </div>
            <div>
              <span className="text-xs text-[#707070] uppercase block font-semibold">Date Posted</span>
              <span className="font-medium text-[#1d1d1f]">{job.datePosted || 'N/A'}</span>
            </div>
            <div>
              <span className="text-xs text-[#707070] uppercase block font-semibold">Current Status</span>
              <span className="font-semibold text-[#0071e3]">{job.status}</span>
            </div>
          </div>

          {/* Links & Recruiter */}
          <div className="flex flex-wrap gap-3">
            {job.jobUrl && (
              <a
                href={job.jobUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-[980px] bg-[#f4f8fb] border border-[#0066cc] text-[#0066cc] text-xs font-medium hover:bg-[#0066cc]/10"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Original Job Posting
              </a>
            )}
            {job.recruiterEmail && (
              <a
                href={`mailto:${job.recruiterEmail}`}
                className="flex items-center gap-2 px-4 py-2 rounded-[980px] bg-[#f5f5f7] border border-[#d2d2d7] text-[#1d1d1f] text-xs font-medium hover:border-[#858585]"
              >
                <Mail className="w-3.5 h-3.5" /> Contact Recruiter ({job.recruiterName || 'Email'})
              </a>
            )}
          </div>

          {/* Job Description & Requirements */}
          {(job.description || job.requirements) && (
            <div className="flex flex-col gap-4 border-t border-[#e2e2e5] pt-4">
              {job.description && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[#707070] mb-2">About the Role</h3>
                  <p className="text-sm text-[#1d1d1f] leading-relaxed bg-[#f5f5f7] p-4 rounded-[8px] border border-[#e2e2e5]">
                    {job.description}
                  </p>
                </div>
              )}
              {job.requirements && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[#707070] mb-2">Requirements</h3>
                  <p className="text-sm text-[#1d1d1f] leading-relaxed bg-[#f5f5f7] p-4 rounded-[8px] border border-[#e2e2e5]">
                    {job.requirements}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Status Timeline */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#707070] mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#0071e3]" /> Status Timeline & Flow
            </h3>
            <div className="border-l-2 border-[#0071e3] pl-4 ml-2 flex flex-col gap-4 py-1 mb-4">
              {historyTimeline.map((item, idx) => (
                <div key={idx} className="relative flex items-center justify-between">
                  <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#0071e3] ring-4 ring-white" />
                  <div className="text-xs font-semibold text-[#1d1d1f] flex items-center gap-2">
                    {item.newStatus}
                    <span className="text-[10px] text-[#707070] font-normal">• {item.changedAt}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveStage(idx)}
                    className="p-1 text-[#858585] hover:text-rose-600 hover:bg-rose-50/50 rounded transition-colors ml-2"
                    title={`Delete status ${item.newStatus}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <div className="relative">
                <div className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-4 ring-white">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
                <div className="text-xs font-bold text-emerald-600">Current Stage: {job.status}</div>
              </div>
            </div>

            {/* Add Status Stage Control */}
            <div className="bg-[#f5f5f7] p-3 rounded-[8px] border border-[#d2d2d7] flex flex-col gap-2">
              <span className="text-xs font-semibold text-[#1d1d1f]">Log Stage Progression</span>
              <div className="flex items-center gap-2">
                <select
                  value={stageStatus}
                  onChange={e => setStageStatus(e.target.value as JobStatus)}
                  className="text-xs font-medium px-2 py-1.5 rounded-[6px] bg-white border border-[#d2d2d7] flex-1 focus:outline-none focus:ring-1 focus:ring-[#0071e3]"
                >
                  {ALL_STATUSES.map(st => {
                    const isUsed = usedStatuses.has(st);
                    return (
                      <option key={st} value={st} disabled={isUsed} className={isUsed ? 'text-[#858585] bg-gray-50' : 'text-[#1d1d1f]'}>
                        {st} {isUsed ? '• used' : ''}
                      </option>
                    );
                  })}
                </select>
                <input
                  type="date"
                  value={stageDate}
                  onChange={e => setStageDate(e.target.value)}
                  className="text-xs px-2 py-1.5 rounded-[6px] bg-white border border-[#d2d2d7] focus:outline-none focus:ring-1 focus:ring-[#0071e3]"
                />
                <button
                  onClick={handleAddStage}
                  className="px-3 py-1.5 bg-[#0071e3] text-white text-xs font-medium rounded-[6px] hover:bg-[#0077ed] transition-colors cursor-pointer"
                >
                  Add Stage
                </button>
              </div>
            </div>
          </div>

          {/* Notes (Autosaving) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#707070]">Application Notes</h3>
              <span className="text-[11px] text-[#858585] italic">Autosaves on blur</span>
            </div>
            <textarea
              rows={4}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              onBlur={handleNotesBlur}
              placeholder="Store recruiter feedback, referral names, interview questions..."
              className="w-full p-3 rounded-[8px] bg-[#f5f5f7] border border-[#d2d2d7] text-sm text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3] transition-all"
            />
          </div>

          {/* Tags Manager */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#707070] mb-2 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-[#0071e3]" /> Custom Tags
            </h3>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {job.tags.map(t => (
                <span key={t} className="inline-flex items-center gap-1 px-3 py-1 rounded-[980px] bg-[#1d1d1f] text-white text-xs font-medium">
                  {t}
                  <button onClick={() => removeTag(t)} className="hover:text-rose-400 ml-1">×</button>
                </span>
              ))}
            </div>
            <form onSubmit={addTag} className="flex gap-2">
              <input
                type="text"
                placeholder="Add tag (e.g. AI, Urgent, Series A)..."
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-[8px] bg-[#f5f5f7] border border-[#d2d2d7] text-xs text-[#1d1d1f] focus:outline-none focus:ring-1 focus:ring-[#0071e3]"
              />
              <button type="submit" className="px-4 py-1.5 rounded-[980px] bg-[#0071e3] text-white text-xs font-medium hover:bg-[#0071e3]/90">
                Add Tag
              </button>
            </form>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-[#e2e2e5] bg-[#f5f5f7] flex justify-end gap-3 sticky bottom-0">
          <button onClick={onClose} className="px-5 py-2 rounded-[980px] border border-[#0066cc] text-[#0066cc] text-sm font-medium hover:bg-[#0066cc]/10">
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
};
