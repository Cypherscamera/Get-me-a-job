export type JobStatus = 
  | 'New' | 'Applied' | 'Not Applied' | 'Rejected' | 'Interview' | 'Offer' | 'Accepted' | 'Not Valid';

export type PriorityLevel = 'High' | 'Medium' | 'Low';

export interface StatusHistoryItem {
  previousStatus: JobStatus;
  newStatus: JobStatus;
  changedAt: string;
  changedBy: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  salaryMin: number;
  salaryMax: number;
  currency?: string;
  salaryText: string;
  employmentType?: string;
  experience?: string;
  location: string;
  country: string;
  city: string;
  workMode: 'Remote' | 'Hybrid' | 'Onsite';
  platform: string;
  source?: string;
  jobUrl?: string;
  companyUrl?: string;
  datePosted?: string;
  dateScraped?: string;
  description?: string;
  requirements?: string;
  status: JobStatus;
  priority?: PriorityLevel;
  favorite: boolean;
  notes?: string;
  recruiterName?: string;
  recruiterEmail?: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
  history?: StatusHistoryItem[];
}

export interface FilterState {
  search: string;
  status: JobStatus[];
  workMode: string[];
  platform: string[];
  experience: string[];
  minSalary: number;
  favoriteOnly: boolean;
  recentlyAddedOnly: boolean;
}
