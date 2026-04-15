import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
  id?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();
  private idCounter = 0;

  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const newToast: Toast = { message, type, id: this.idCounter++ };
    const currentToasts = this.toastsSubject.value;
    
    // Play slightly pop sound or simply add
    this.toastsSubject.next([...currentToasts, newToast]);

    // Auto remove after 3 seconds
    setTimeout(() => this.remove(newToast.id!), 3000);
  }

  remove(id: number) {
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next(currentToasts.filter(t => t.id !== id));
  }
}
