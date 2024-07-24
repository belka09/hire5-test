import { Component, computed, Signal } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

import { ApiService } from './../../services/api.service';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class GridComponent {
  products: Signal<Product[]> = computed(() => this.apiService.products());

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.apiService.getProducts();
  }

  createNewProduct(): void {
    this.router.navigateByUrl(`/product`);
  }

  updateProduct(id: number): void {
    this.router.navigateByUrl(`/product/${id}`);
  }

  deleteProduct(event: Event, id: number): void {
    event.stopPropagation();
    this.apiService.deleteProduct(id).subscribe(() => {
      const filteredProducts = this.products().filter((p) => p.id !== id);
      this.apiService.products.set(filteredProducts);
    });
  }
}
