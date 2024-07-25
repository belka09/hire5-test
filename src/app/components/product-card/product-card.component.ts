import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ApiService } from '../../services/api.service';
import { CustomPropertyEditorComponent } from '../custom-property/custom-property.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CustomPropertyEditorComponent,
    RouterLink,
  ],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  productForm!: FormGroup;
  isEditMode = false;
  initialData: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const productId = params['id'];
        if (productId) {
          this.apiService
            .getProducts()
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
              this.isEditMode = true;
              const activeItem = this.apiService
                .products()
                .find((item) => item.id === +productId);
              this.initialData = activeItem;
              this.initializeForm(activeItem);
            });
        } else {
          this.isEditMode = false;
          this.initializeForm();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeForm(activeItem?: any): void {
    const profile = activeItem?.profile ? { ...activeItem.profile } : {};

    this.productForm = this.fb.group({
      name: [activeItem?.name || '', Validators.required],
      description: [activeItem?.description || '', Validators.required],
      sku: [activeItem?.sku || '', Validators.required],
      cost: [
        activeItem?.cost || 0,
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
        ],
      ],
      profile: this.fb.group({
        type: [profile.type || 'furniture'],
        available: [profile.available ?? true],
        backlog: [profile.backlog || ''],
        customProperties: [profile.customProperties || {}],
      }),
    });

    this.productForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.onProfileChange();
      });
  }

  createProduct(): void {
    const { id, ...product } = this.productForm.value;
    product.profile = { ...product.profile };
    this.apiService
      .createProduct(product)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.router.navigate(['/products']);
      });
  }

  updateProduct(): void {
    const productId = +this.activatedRoute.snapshot.params['id'];
    const changes = this.getChangedFields(
      this.initialData,
      this.productForm.value
    );
    changes.profile = { ...changes.profile };
    this.apiService
      .updateProduct(productId, changes)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.router.navigate(['/products']);
      });
  }

  getChangedFields(initialData: any, currentData: any): any {
    const changes: any = {};
    for (const key in currentData) {
      if (currentData[key] !== initialData[key]) {
        changes[key] = currentData[key];
      }
    }

    if (currentData.profile) {
      changes.profile = {};
      for (const key in currentData.profile) {
        if (currentData.profile[key] !== initialData.profile[key]) {
          changes.profile[key] = currentData.profile[key];
        }
      }
      if (Object.keys(changes.profile).length === 0) {
        delete changes.profile;
      }
    }

    return changes;
  }

  onProfileChange(): void {
    const profile = this.productForm.get('profile')!.value;
    this.productForm.patchValue({ profile }, { emitEvent: false });
  }

  onCustomPropertiesChange(customProperties: { [key: string]: string }): void {
    this.productForm.patchValue(
      {
        profile: {
          ...this.productForm.get('profile')!.value,
          customProperties,
        },
      },
      { emitEvent: false }
    );
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      if (this.isEditMode) {
        this.updateProduct();
      } else {
        this.createProduct();
      }
    }
  }
}
