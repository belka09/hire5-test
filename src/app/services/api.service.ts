import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, finalize, delay } from 'rxjs/operators';
import { ToasterService } from './toaster.service';
import { LoaderService } from './loader.service';
import { AuthService } from './auth.service';
import { Product } from '../interfaces/product';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public products: WritableSignal<Product[]> = signal([]);

  constructor(
    private http: HttpClient,
    private toasterService: ToasterService,
    private loaderService: LoaderService,
    private authService: AuthService
  ) {}

  public getProducts(): void {
    this.loaderService.showLoader();
    this.http
      .get<Product[]>(environment.apiUrl, {
        headers: { Authorization: `Bearer ${this.authService.token()}` },
      })
      .pipe(
        delay(1000),
        finalize(() => this.loaderService.hideLoader()),
        catchError(this.handleError.bind(this))
      )
      .subscribe((items) => {
        this.products.set(items);
      });
  }

  public createProduct(product: Product): Observable<Product> {
    this.loaderService.showLoader();
    return this.http
      .post<Product>(environment.apiUrl, product, {
        headers: { Authorization: `Bearer ${this.authService.token()}` },
      })
      .pipe(
        delay(1000),
        tap(() =>
          this.toasterService.showSuccess('Product created successfully')
        ),
        finalize(() => this.loaderService.hideLoader()),
        catchError(this.handleError.bind(this))
      );
  }

  public updateProduct(
    id: number,
    updatedFields: Partial<Product>
  ): Observable<Product> {
    const url = `${environment.apiUrl}/${id}`;
    this.loaderService.showLoader();
    return this.http
      .patch<Product>(url, updatedFields, {
        headers: { Authorization: `Bearer ${this.authService.token()}` },
      })
      .pipe(
        delay(1000),
        tap(() =>
          this.toasterService.showSuccess('Product updated successfully')
        ),
        finalize(() => this.loaderService.hideLoader()),
        catchError(this.handleError.bind(this))
      );
  }

  public deleteProduct(id: number): Observable<void> {
    const url = `${environment.apiUrl}/${id}`;
    this.loaderService.showLoader();
    return this.http
      .delete<void>(url, {
        headers: { Authorization: `Bearer ${this.authService.token()}` },
      })
      .pipe(
        delay(1000),
        tap(() =>
          this.toasterService.showSuccess('Product deleted successfully')
        ),
        finalize(() => this.loaderService.hideLoader()),
        catchError(this.handleError.bind(this))
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    this.loaderService.hideLoader();
    this.toasterService.showError(
      'Something bad happened; please try again later.'
    );
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
