import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  name: string;
  role: 'student' | 'admin' | 'superadmin';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  // Mocked Database of Users
  private users: User[] = [
    { name: 'Pravin Pandey', role: 'student' },
    { name: 'Admin', role: 'admin' },
    { name: 'Superadmin', role: 'superadmin' }
  ];

  // Manual Authorization Tracking
  private pendingAdminRequests = new BehaviorSubject<string[]>([]);
  pendingRequests$ = this.pendingAdminRequests.asObservable();
  
  private approvedAdminNames: string[] = []; // Permanent approvals for this session

  // Try logging in
  login(userName: string, role: 'student' | 'admin' | 'superadmin' = 'student'): boolean {
    if (role === 'admin') {
      // Admin actually logs in only if they are approved
      const isApproved = this.approvedAdminNames.includes(userName.toLowerCase());
      if (!isApproved) return false;
    }

    const existingUser = this.users.find(u => u.name.toLowerCase() === userName.toLowerCase() && u.role === role);
    if (existingUser) {
      this.userSubject.next(existingUser);
      return true;
    }
    return false;
  }

  // Superadmin Secret Login
  loginSuperAdmin(email: string, secretKey: string, pass: string): boolean {
    if (email === 'superadmin@tnp.edu' && secretKey === 'MacBook' && pass === 'MacAir@786') {
      const superUser: User = { name: 'Principal / Superadmin', role: 'superadmin' };
      this.userSubject.next(superUser);
      return true;
    }
    return false;
  }

  // Requesting Admin Access
  requestAdminAccess(name: string) {
    const current = this.pendingAdminRequests.value;
    if (!current.includes(name)) {
      this.pendingAdminRequests.next([...current, name]);
    }
  }

  // Superadmin Authorizing
  authorizeAdmin(name: string) {
    // 1. Add to approved list
    if (!this.approvedAdminNames.includes(name.toLowerCase())) {
      this.approvedAdminNames.push(name.toLowerCase());
    }

    // 2. Add to user database so their name is preserved during login
    const exists = this.users.find(u => u.name.toLowerCase() === name.toLowerCase() && u.role === 'admin');
    if (!exists) {
      this.users.push({ name: name, role: 'admin' });
    }

    // 3. Remove from pending
    const remaining = this.pendingAdminRequests.value.filter(n => n !== name);
    this.pendingAdminRequests.next(remaining);
  }

  isAuthorized(name: string): boolean {
    return this.approvedAdminNames.includes(name.toLowerCase());
  }

  // Registering a new User
  register(userName: string): boolean {
    const exists = this.users.find(u => u.name.toLowerCase() === userName.toLowerCase() && u.role === 'student');
    if (exists) {
      return false;
    }
    this.users.push({ name: userName, role: 'student' });
    return true;
  }

  logout() {
    this.userSubject.next(null);
  }
}