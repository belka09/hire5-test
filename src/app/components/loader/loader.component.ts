import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if(isLoading$ | async) {
    <div
      class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center"
    >
      <div
        class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
        role="status"
      ></div>
    </div>
    }
  `,
  styles: [
    `
      .spinner-border {
        border-top-color: transparent;
        border-right-color: white;
        border-bottom-color: white;
        border-left-color: white;
      }
    `,
  ],
})
export class LoaderComponent {
  isLoading$ = this.loaderService.isLoading$;

  constructor(private loaderService: LoaderService) {}
}
