import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent {

  constructor(private authService: AuthService, private router: Router, private toastService: ToastService) {}

  isAuthorizing: boolean = false;
  showSuperAdminLogin: boolean = false;
  pollingInterval: any;

  submitLogin(name: string, role: 'student' | 'admin') {
    if (!name || !name.trim()) {
      this.toastService.show("Please enter your name to sign in.", 'error');
      return;
    }

    if (role === 'admin') {
      // Check if already authorized
      if (this.authService.isAuthorized(name)) {
        this.authService.login(name, 'admin');
        this.toastService.show(`Welcome back, Admin ${name}! Access Granted.`, 'success');
        this.router.navigate(['/contests']);
        return;
      }

      // Request access and wait
      this.authService.requestAdminAccess(name);
      this.toastService.show("📨 Access Requested. Superadmin must 'Allow' your request from the Authorization Panel.", 'info');
      this.isAuthorizing = true;
      
      this.pollingInterval = setInterval(() => {
        const success = this.authService.login(name, 'admin');
        if (success) {
          this.toastService.show(`✅ Superadmin Authorized! Welcome back, ${name}.`, 'success');
          this.isAuthorizing = false;
          clearInterval(this.pollingInterval);
          this.router.navigate(['/contests']);
        }
      }, 2000);

    } else {
      const success = this.authService.login(name, role);
      if (success) {
        this.toastService.show(`Welcome back, ${name}! Signed in as student.`, 'success');
        this.router.navigate(['/contests']);
      } else {
        this.toastService.show(`User "${name}" not found. Please register first.`, 'error');
      }
    }
  }

  submitSuperAdminLogin(email: string, key: string, pass: string) {
    if (this.authService.loginSuperAdmin(email, key, pass)) {
      this.toastService.show("Superadmin Verified! Opening Authorization Hub.", 'success');
      this.router.navigate(['/contests']);
    } else {
      this.toastService.show("Invalid Email, Secret Key or Password.", 'error');
    }
  }

  ngOnDestroy() {
    if (this.pollingInterval) clearInterval(this.pollingInterval);
  }
}