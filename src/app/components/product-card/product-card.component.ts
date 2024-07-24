import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

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
export class ProductCardComponent implements OnInit {
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
    this.activatedRoute.params.subscribe((params) => {
      const productId = params['id'];
      if (productId) {
        this.isEditMode = true;
        const activeItem = this.apiService
          .products()
          .find((item) => item.id === +productId);
        this.initialData = activeItem;
        this.initializeForm(activeItem);
      } else {
        this.isEditMode = false;
        this.initializeForm();
      }

      this.productForm.valueChanges.subscribe(() => {
        this.onProfileChange();
      });
    });
  }

  initializeForm(activeItem?: any): void {
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
        type: [activeItem?.profile?.type || 'furniture'],
        available: [activeItem?.profile?.available ?? true],
        backlog: [activeItem?.profile?.backlog || ''],
      }),
    });

    if (activeItem?.profile) {
      this.addCustomProperties(activeItem.profile);
    }
  }

  createProduct(): void {
    const { id, ...product } = this.productForm.value;
    this.apiService.createProduct(product).subscribe((newProduct) => {
      this.router.navigate(['/products']);
    });
  }

  updateProduct(): void {
    const productId = +this.activatedRoute.snapshot.params['id'];
    const changes = this.getChangedFields(
      this.initialData,
      this.productForm.value
    );
    this.apiService.updateProduct(productId, changes).subscribe(() => {
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

  onCustomPropertiesChange(customProperties: any): void {
    const profile = {
      ...this.productForm.get('profile')!.value,
      ...customProperties,
    };
    this.productForm.patchValue({ profile });
  }

  private addCustomProperties(profile: any): void {
    const profileGroup = this.productForm.get('profile') as FormGroup;
    for (const key of Object.keys(profile)) {
      if (!profileGroup.get(key)) {
        profileGroup.addControl(key, this.fb.control(profile[key]));
      }
    }
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
