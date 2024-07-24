import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
  message: string;
  type: 'error' | 'success';
}

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  private toastSubject = new Subject<ToastMessage>();
  toastState = this.toastSubject.asObservable();

  showError(message: string) {
    this.toastSubject.next({ message, type: 'error' });
  }

  showSuccess(message: string) {
    this.toastSubject.next({ message, type: 'success' });
  }
}
