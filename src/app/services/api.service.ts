import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ToasterService } from './toaster.service';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://rest-items.research.cloudonix.io/items';

  token: WritableSignal<string> = signal('');

  products: WritableSignal<Product[]> = signal([]);

  constructor(
    private http: HttpClient,
    private toasterService: ToasterService
  ) {}

  getProducts(): void {
    this.http
      .get<Product[]>(this.apiUrl)
      .pipe(catchError(this.handleError.bind(this)))
      .subscribe((items) => {
        this.products.set(items);
      });
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product).pipe(
      tap(() =>
        this.toasterService.showSuccess('Product created successfully')
      ),
      catchError(this.handleError.bind(this))
    );
  }

  updateProduct(
    id: number,
    updatedFields: Partial<Product>
  ): Observable<Product> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.patch<Product>(url, updatedFields).pipe(
      tap(() =>
        this.toasterService.showSuccess('Product updated successfully')
      ),
      catchError(this.handleError.bind(this))
    );
  }

  deleteProduct(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      tap(() =>
        this.toasterService.showSuccess('Product deleted successfully')
      ),
      catchError(this.handleError.bind(this))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error(`An error occurred: ${error.message}`);
    this.toasterService.showError(
      'Something bad happened; please try again later.'
    );
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
