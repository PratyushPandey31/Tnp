import { Component, OnInit } from '@angular/core';
import { AuthService, User } from './modules/auth/services/auth.service';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements OnInit {
  loggedInUser: any = null;
  toasts: any[] = [];

  constructor(private authService: AuthService, private toastService: ToastService) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.loggedInUser = user;
    });
    this.toastService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  onLogout() {
    this.authService.logout();
    this.toastService.show('Logged out successfully', 'info');
  }

  removeToast(id: number) {
    this.toastService.remove(id);
  }
}