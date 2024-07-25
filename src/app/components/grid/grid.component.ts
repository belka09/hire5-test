import { Component, OnInit, OnDestroy, computed, Signal } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ApiService } from './../../services/api.service';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  products: Signal<Product[]> = computed(() => this.apiService.products());

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.apiService
      .getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe((products) => {
        this.apiService.products.set(products);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createNewProduct(): void {
    this.router.navigateByUrl(`/product`);
  }

  updateProduct(id: number): void {
    this.router.navigateByUrl(`/product/${id}`);
  }

  deleteProduct(event: Event, id: number): void {
    event.stopPropagation();
    this.apiService
      .deleteProduct(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const filteredProducts = this.products().filter((p) => p.id !== id);
        this.apiService.products.set(filteredProducts);
      });
  }
}
