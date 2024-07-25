import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Toast } from '../interfaces/toast';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  private toastSubject = new Subject<Toast>();
  public toastState = this.toastSubject.asObservable();

  public showError(message: string) {
    this.toastSubject.next({ message, type: 'error' });
  }

  public showSuccess(message: string) {
    this.toastSubject.next({ message, type: 'success' });
  }
}
