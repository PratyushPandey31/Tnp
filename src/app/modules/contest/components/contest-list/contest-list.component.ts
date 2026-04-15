import { Component, OnInit } from '@angular/core';
import { ContestService } from '../../services/contest.service';
import { Contest } from '../../models/contest.model';
import { AuthService } from '../../../auth/services/auth.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-contest-list',
  templateUrl: './contest-list.component.html',
  styleUrls: ['./contest-list.component.css'],
  standalone: false
})
export class ContestListComponent implements OnInit {
  allContests: Contest[] = []; 
  filteredContests: Contest[] = [];
  
  searchTerm: string = '';
  activeCategory: string = 'All';
  showModal: boolean = false;
  registeredEvent: string = '';

  userRole: 'student' | 'admin' | 'superadmin' | null = null;
  loggedInUserName: string = '';
  myRegistrations: { contestId: number, score: number }[] = [];
  pendingAdminRequests: string[] = [];

  showCreateModal: boolean = false;
  newContest: Partial<Contest> = { type: 'Coding', status: 'Live', date: '' };

  showReportModal: boolean = false;
  activeReport: { title: string, score: number, status: string } = { title: '', score: 0, status: '' };

  get totalContests() { return this.allContests.length; }
  get liveContests() { return this.allContests.filter(c => c.status === 'Live').length; }
  get upcomingContests() { return this.allContests.filter(c => c.status === 'Upcoming').length; }

  constructor(private contestService: ContestService, private authService: AuthService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.userRole = user.role;
        this.loggedInUserName = user.name;
        this.refreshMyRegistrations();
      } else {
        this.userRole = null;
        this.loggedInUserName = '';
      }
    });

    // Superadmin Subscription
    this.authService.pendingRequests$.subscribe(reqs => {
      this.pendingAdminRequests = reqs;
    });

    this.contestService.getContests().subscribe(data => {
      this.allContests = data;
      this.applyFilters();
    });
  }

  onAuthorize(name: string) {
    this.authService.authorizeAdmin(name);
    this.toastService.show(`Success! ${name} is now an authorized Admin.`, 'success');
  }

  onDismiss(name: string) {
    // We can just call authorize with an empty logic or specialized dismiss if we want
    // For now, let's keep it simple
    this.toastService.show(`Request from ${name} dismissed.`, 'info');
  }

  refreshMyRegistrations() {
    if (this.userRole === 'student') {
      this.contestService.getStudentRegistrations(this.loggedInUserName).subscribe(regs => {
        this.myRegistrations = regs.map(r => ({ contestId: r.contestId, score: r.score }));
        this.applyFilters(); // Re-apply filters in case 'My Activity' is active
      });
    }
  }

  // Updated filter logic to support 'My Activity'
  applyFilters(category?: string) {
    if (category) this.activeCategory = category;

    this.filteredContests = this.allContests.filter(contest => {
      const matchText = this.searchTerm.toLowerCase();
      const matchesSearch = contest.title.toLowerCase().includes(matchText) || contest.id.toString().includes(matchText);
      
      let matchesCategory = false;
      if (this.activeCategory === 'All') {
        matchesCategory = true;
      } else if (this.activeCategory === 'My Activity') {
        matchesCategory = this.isRegistered(contest.id);
      } else {
        matchesCategory = contest.type === this.activeCategory;
      }
      
      return matchesSearch && matchesCategory;
    });
  }

  // --- Student Specific Logic ---
  isRegistered(contestId: number): boolean {
    return this.myRegistrations.some(r => r.contestId === contestId);
  }

  onRegister(contest: Contest) {
    if (this.userRole === 'admin' || this.userRole === 'superadmin') return;

    if (!this.userRole) {
      this.toastService.show("Please sign in as a Student to register for contests.", 'error');
      return;
    }

    // Custom check for already registered
    if (this.isRegistered(contest.id)) {
      this.toastService.show(`You had already registered for these event ${contest.title}`, 'info');
      return;
    }

    this.contestService.registerStudent(this.loggedInUserName, contest.id).subscribe(success => {
      if (success) {
        this.registeredEvent = contest.title;
        this.showModal = true;
        this.toastService.show(`Registration complete for ${contest.title}...`, 'info');
        this.refreshMyRegistrations();
      }
    });
  }

  closeModal() {
    this.showModal = false;
  }

  onViewReport(contest: Contest) {
    const registration = this.myRegistrations.find(r => r.contestId === contest.id);
    if (registration) {
      this.activeReport = {
        title: contest.title,
        score: registration.score,
        status: registration.score >= 50 ? 'Passed ✅' : 'Requires Retake ❌'
      };
      this.showReportModal = true;
    }
  }

  closeReportModal() {
    this.showReportModal = false;
  }

  // --- Admin Specific Logic ---
  onDelete(id: number) {
    if(confirm('Are you sure you want to delete this contest?')) {
      this.contestService.deleteContest(id).subscribe(success => {
        if (success) {
          this.toastService.show("Contest deleted successfully.", 'success');
          this.ngOnInit();
        }
      });
    }
  }

  showModifyModal: boolean = false;
  modifyingContest: Partial<Contest> = {};

  openCreateModal() { this.showCreateModal = true; }
  closeCreateModal() { this.showCreateModal = false; }

  onCreateContest() {
    if(this.newContest.title && this.newContest.description) {
      this.contestService.addContest({
        id: 0,
        title: this.newContest.title,
        description: this.newContest.description,
        type: this.newContest.type as any,
        status: this.newContest.status as any,
        date: this.newContest.date || new Date().toISOString()
      }).subscribe(() => {
        this.toastService.show(`Contest "${this.newContest.title}" created!`, 'success');
        this.closeCreateModal();
        this.ngOnInit();
      });
    } else {
      this.toastService.show("Please provide a title and description.", 'error');
    }
  }

  onModify(contest: Contest) {
    this.modifyingContest = { ...contest };
    this.showModifyModal = true;
  }

  closeModifyModal() {
    this.showModifyModal = false;
  }

  onSaveModifyContest() {
    if (this.modifyingContest.id && this.modifyingContest.title) {
      this.contestService.updateContest(this.modifyingContest as Contest).subscribe(() => {
        this.toastService.show("Contest modifications saved.", 'success');
        this.closeModifyModal();
        this.ngOnInit();
      });
    } else {
      this.toastService.show("Invalid contest modifications.", 'error');
    }
  }

  getDaysLeft(dateStr: string): string {
    const today = new Date();
    const targetDate = new Date(dateStr);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) return `In ${diffDays} Days`;
    if (diffDays === 0) return 'Today';
    return '';
  }
}