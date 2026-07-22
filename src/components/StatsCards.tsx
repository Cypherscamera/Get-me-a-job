import React from 'react';
import { Job } from '@/types/job';
import { Briefcase, Send, Calendar, Award, XCircle, Globe, DollarSign, Bookmark } from 'lucide-react';

interface StatsCardsProps {
  jobs: Job[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ jobs }) => {
  // ponytail: compute metrics in one pass
  const total = jobs.length;
  const applied = jobs.filter(j => j.status === 'Applied').length;
  const interviewing = jobs.filter(j => j.status === 'Interview').length;
  const offers = jobs.filter(j => ['Offer', 'Accepted'].includes(j.status)).length;
  const rejected = jobs.filter(j => j.status === 'Rejected' || j.status === 'Not Applied' || j.status === 'Not Valid').length;
  const remote = jobs.filter(j => j.workMode === 'Remote').length;
  const saved = jobs.filter(j => j.favorite).length;

  const validSalaries = jobs.filter(j => j.salaryMin > 0).map(j => j.salaryMin);
  const avgSalary = validSalaries.length ? Math.round(validSalaries.reduce((a, b) => a + b, 0) / validSalaries.length) : 0;

  const cards = [
    { label: 'Total Jobs', val: total, icon: Briefcase, color: 'text-[#1d1d1f]' },
    { label: 'Applied', val: applied, icon: Send, color: 'text-[#0071e3]' },
    { label: 'Interviewing', val: interviewing, icon: Calendar, color: 'text-[#2997ff]' },
    { label: 'Offers', val: offers, icon: Award, color: 'text-emerald-600' },
    { label: 'Rejected', val: rejected, icon: XCircle, color: 'text-rose-600' },
    { label: 'Remote Jobs', val: remote, icon: Globe, color: 'text-purple-600' },
    { label: 'Avg Salary', val: avgSalary ? `$${(avgSalary / 1000).toFixed(0)}k` : 'N/A', icon: DollarSign, color: 'text-[#1d1d1f]' },
    { label: 'Saved Jobs', val: saved, icon: Bookmark, color: 'text-amber-500' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 my-6">
      {cards.map((c, idx) => (
        <div key={idx} className="bg-white p-4 rounded-[8px] border border-[#d2d2d7] flex flex-col justify-between shadow-2xs hover:border-[#858585] transition-colors">
          <div className="flex items-center justify-between text-[#707070] mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">{c.label}</span>
            <c.icon className="w-4 h-4" />
          </div>
          <span className={`text-2xl font-semibold tracking-tight ${c.color}`}>{c.val}</span>
        </div>
      ))}
    </div>
  );
};
