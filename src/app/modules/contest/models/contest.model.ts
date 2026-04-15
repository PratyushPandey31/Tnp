export interface Contest {
  id: number;
  title: string;
  description: string;
  date: string;
  type: 'Coding' | 'Aptitude' | 'Quiz';
  status: 'Live' | 'Upcoming' | 'Completed';
}