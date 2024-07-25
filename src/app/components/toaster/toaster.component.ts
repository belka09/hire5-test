import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToasterService } from '../../services/toaster.service';
import { Toast } from '../../interfaces/toast';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-0 right-0 m-4 flex flex-col space-y-2">
      <div
        *ngFor="let toast of toasts; trackBy: trackByFn"
        [ngClass]="toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'"
        class="text-white p-4 rounded shadow-md"
      >
        {{ toast.message }}
      </div>
    </div>
  `,
})
export class ToasterComponent implements OnInit {
  toasts: Toast[] = [];

  constructor(private toasterService: ToasterService) {}

  ngOnInit() {
    this.toasterService.toastState.subscribe((toast: Toast) => {
      this.toasts.push(toast);
      setTimeout(() => this.toasts.shift(), 3000);
    });
  }

  trackByFn(index: number, item: Toast): number {
    return index;
  }
}
