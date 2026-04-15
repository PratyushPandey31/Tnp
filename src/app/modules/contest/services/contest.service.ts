import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Contest } from '../models/contest.model';

@Injectable({ providedIn: 'root' })
export class ContestService {
  private mockData: Contest[] = [
    { id: 1, title: 'Weekly DSA Challenge', description: 'Solve 3 medium level problems on Arrays and Trees.', date: '2026-04-05', type: 'Coding', status: 'Live' },
    { id: 2, title: 'TCS NQT Mock Test', description: 'Full length aptitude, verbal, and coding mock for TCS NQT.', date: '2026-04-12', type: 'Aptitude', status: 'Upcoming' },
    { id: 3, title: 'Web Tech Quiz', description: 'Test your knowledge on HTML5, CSS3, and Modern JavaScript.', date: '2026-03-20', type: 'Quiz', status: 'Completed' },
    { id: 4, title: 'Python for Data Science', description: 'Basic to intermediate Python questions for Data roles.', date: '2026-04-20', type: 'Coding', status: 'Upcoming' },
    { id: 5, title: 'Infosys SP/DSE Mock', description: 'Specialist Programmer level coding challenges.', date: '2026-04-01', type: 'Coding', status: 'Live' },
    { id: 6, title: 'Logical Reasoning Marathon', description: '60 minutes of intensive logical and analytical puzzles.', date: '2026-04-18', type: 'Aptitude', status: 'Upcoming' },
    { id: 7, title: 'Core Java Fundamentals', description: 'Deep dive into OOPs, Collections, and Exception Handling.', date: '2026-05-02', type: 'Quiz', status: 'Upcoming' },
    { id: 8, title: 'SQL & Database Design', description: 'Query optimization and schema design challenges.', date: '2026-05-05', type: 'Coding', status: 'Upcoming' },
    { id: 9, title: 'Cognizant GenC Mock', description: 'Practice test for GenC and GenC Next placement patterns.', date: '2026-05-10', type: 'Aptitude', status: 'Upcoming' }
  ];

  // 1. GET ALL: Purana wala logic (Same)
  getContests(): Observable<Contest[]> { 
    return of(this.mockData); 
  }

  // 2. GET BY ID: Naya feature
  getContestById(id: number): Observable<Contest | undefined> {
    const contest = this.mockData.find(c => c.id === id);
    return of(contest);
  }

  // 3. POST (ADD): Naya feature
  addContest(contest: Contest): Observable<Contest> {
    // Naya ID generate karna
    const newId = this.mockData.length > 0 ? Math.max(...this.mockData.map(c => c.id)) + 1 : 1;
    const newContest = { ...contest, id: newId };
    this.mockData.push(newContest);
    return of(newContest);
  }

  // 4. DELETE: Naya feature
  deleteContest(id: number): Observable<boolean> {
    const index = this.mockData.findIndex(c => c.id === id);
    if (index !== -1) {
      this.mockData.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  // 5. UPDATE: Modify Contest
  updateContest(updatedContest: Contest): Observable<boolean> {
    const index = this.mockData.findIndex(c => c.id === updatedContest.id);
    if (index !== -1) {
      this.mockData[index] = updatedContest;
      return of(true);
    }
    return of(false);
  }

  // --- STUDENT REGISTRATION TRACKING (Mocked) ---
  private studentRegistrations: { userName: string, contestId: number, score: number }[] = [
    // Pre-populate some data for demonstration
    { userName: 'Pravin Pandey', contestId: 1, score: 0 }, // Live
    { userName: 'Pravin Pandey', contestId: 3, score: 85 } // Completed
  ];

  registerStudent(userName: string, contestId: number): Observable<boolean> {
    const exists = this.studentRegistrations.find(r => r.userName === userName && r.contestId === contestId);
    if (!exists) {
      // Mock a random score for future reports (between 40 and 99)
      const mockScore = Math.floor(Math.random() * 60) + 40;
      this.studentRegistrations.push({ userName, contestId, score: mockScore });
      return of(true);
    }
    return of(false);
  }

  getStudentRegistrations(userName: string): Observable<{ userName: string, contestId: number, score: number }[]> {
    return of(this.studentRegistrations.filter(r => r.userName === userName));
  }
}