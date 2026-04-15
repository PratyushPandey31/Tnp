import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: false
})
export class RegisterComponent {

  constructor(private authService: AuthService, private router: Router, private toastService: ToastService) {}

  submitRegister(name: string) {
    if (name && name.trim()) {
      const success = this.authService.register(name);
      if (success) {
        this.authService.login(name); // Log them in automatically upon successful registration
        this.toastService.show("Student Registration Successful!", 'success');
        this.router.navigate(['/contests']);
      } else {
        this.toastService.show("User already exists. Please sign in instead.", 'error');
      }
    } else {
      this.toastService.show("Please enter your name to complete registration.", 'error');
    }
  }
}