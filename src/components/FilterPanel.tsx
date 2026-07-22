import React from 'react';
import { FilterState, JobStatus } from '@/types/job';
import { Filter, Star, Clock, DollarSign, Briefcase } from 'lucide-react';

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

const ALL_STATUSES: JobStatus[] = [
  'New', 'Applied', 'Not Applied', 'Rejected', 'Interview', 'Offer', 'Accepted', 'Not Valid'
];

const PLATFORMS = ['Direct Startup Board', 'Tech Job Feed', 'LinkedIn', 'Inclusivelyremote', 'Crossover Remote', 'Wellfound', 'Agent Reach', 'Scrapling', 'Manual'];
const WORK_MODES = ['Remote', 'Hybrid', 'Onsite'];
const EXPERIENCE_LEVELS = ['0-2 years', '2-5 years', '5-8 years', '8+ years'];

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onChange }) => {
  const toggleStatus = (st: JobStatus) => {
    const next = filters.status.includes(st)
      ? filters.status.filter(s => s !== st)
      : [...filters.status, st];
    onChange({ ...filters, status: next });
  };

  const togglePlatform = (pl: string) => {
    const next = filters.platform.includes(pl)
      ? filters.platform.filter(p => p !== pl)
      : [...filters.platform, pl];
    onChange({ ...filters, platform: next });
  };

  const toggleWorkMode = (wm: string) => {
    const next = filters.workMode.includes(wm)
      ? filters.workMode.filter(w => w !== wm)
      : [...filters.workMode, wm];
    onChange({ ...filters, workMode: next });
  };

  const toggleExperience = (exp: string) => {
    const next = filters.experience.includes(exp)
      ? filters.experience.filter(e => e !== exp)
      : [...filters.experience, exp];
    onChange({ ...filters, experience: next });
  };

  const hasActiveFilters = filters.status.length > 0 || filters.platform.length > 0 || filters.workMode.length > 0 || filters.experience.length > 0 || filters.minSalary > 0 || filters.favoriteOnly || filters.recentlyAddedOnly;

  return (
    <aside className="w-full md:w-64 bg-white p-5 rounded-[8px] border border-[#d2d2d7] flex flex-col gap-6 self-start shrink-0 shadow-2xs">
      <div className="flex items-center justify-between border-b border-[#e2e2e5] pb-3">
        <div className="flex items-center gap-2 text-[#1d1d1f] font-semibold text-base">
          <Filter className="w-4 h-4 text-[#0071e3]" />
          Filters
        </div>
        {hasActiveFilters && (
          <button
            onClick={() => onChange({ search: filters.search, status: [], workMode: [], platform: [], experience: [], minSalary: 0, favoriteOnly: false, recentlyAddedOnly: false })}
            className="text-xs text-[#0066cc] hover:underline font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Quick Toggles */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm text-[#1d1d1f] cursor-pointer">
          <input
            type="checkbox"
            checked={filters.favoriteOnly}
            onChange={e => onChange({ ...filters, favoriteOnly: e.target.checked })}
            className="rounded border-[#d2d2d7] text-[#0071e3] focus:ring-[#0071e3]"
          />
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          Saved Jobs Only
        </label>
        <label className="flex items-center gap-2 text-sm text-[#1d1d1f] cursor-pointer">
          <input
            type="checkbox"
            checked={filters.recentlyAddedOnly}
            onChange={e => onChange({ ...filters, recentlyAddedOnly: e.target.checked })}
            className="rounded border-[#d2d2d7] text-[#0071e3] focus:ring-[#0071e3]"
          />
          <Clock className="w-4 h-4 text-[#0071e3]" />
          Recently Added
        </label>
      </div>

      {/* Minimum Salary Slider */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <h4 className="text-xs font-semibold text-[#707070] uppercase tracking-wider flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-[#0071e3]" /> Min Salary
          </h4>
          <span className="text-xs font-bold text-[#1d1d1f]">
            {filters.minSalary === 0 ? 'Any' : `$${(filters.minSalary / 1000).toFixed(0)}k+`}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="180000"
          step="20000"
          value={filters.minSalary}
          onChange={e => onChange({ ...filters, minSalary: Number(e.target.value) })}
          className="w-full accent-[#0071e3] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[#858585] mt-1">
          <span>$0</span>
          <span>$100k</span>
          <span>$180k+</span>
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <h4 className="text-xs font-semibold text-[#707070] uppercase tracking-wider mb-2 flex items-center gap-1">
          <Briefcase className="w-3.5 h-3.5 text-[#0071e3]" /> Experience
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {EXPERIENCE_LEVELS.map(exp => (
            <button
              key={exp}
              onClick={() => toggleExperience(exp)}
              className={`px-3 py-1 rounded-[980px] text-xs font-medium border transition-colors ${
                filters.experience.includes(exp)
                  ? 'bg-[#0071e3] text-white border-[#0071e3]'
                  : 'bg-[#f5f5f7] text-[#333333] border-[#d2d2d7] hover:border-[#858585]'
              }`}
            >
              {exp}
            </button>
          ))}
        </div>
      </div>

      {/* Work Mode */}
      <div>
        <h4 className="text-xs font-semibold text-[#707070] uppercase tracking-wider mb-2">Work Mode</h4>
        <div className="flex flex-wrap gap-1.5">
          {WORK_MODES.map(wm => (
            <button
              key={wm}
              onClick={() => toggleWorkMode(wm)}
              className={`px-3 py-1 rounded-[980px] text-xs font-medium border transition-colors ${
                filters.workMode.includes(wm)
                  ? 'bg-[#0071e3] text-white border-[#0071e3]'
                  : 'bg-[#f5f5f7] text-[#333333] border-[#d2d2d7] hover:border-[#858585]'
              }`}
            >
              {wm}
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div>
        <h4 className="text-xs font-semibold text-[#707070] uppercase tracking-wider mb-2">Status Pipeline</h4>
        <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
          {ALL_STATUSES.map(st => (
            <label key={st} className="flex items-center gap-2 text-sm text-[#333333] cursor-pointer hover:text-[#1d1d1f]">
              <input
                type="checkbox"
                checked={filters.status.includes(st)}
                onChange={() => toggleStatus(st)}
                className="rounded border-[#d2d2d7] text-[#0071e3] focus:ring-[#0071e3]"
              />
              <span className="truncate">{st}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Platform */}
      <div>
        <h4 className="text-xs font-semibold text-[#707070] uppercase tracking-wider mb-2">Platform Source</h4>
        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
          {PLATFORMS.map(pl => (
            <button
              key={pl}
              onClick={() => togglePlatform(pl)}
              className={`px-2.5 py-1 rounded-[980px] text-xs border transition-colors ${
                filters.platform.includes(pl)
                  ? 'bg-[#1d1d1f] text-white border-[#1d1d1f]'
                  : 'bg-white text-[#707070] border-[#d2d2d7] hover:border-[#858585]'
              }`}
            >
              {pl}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
