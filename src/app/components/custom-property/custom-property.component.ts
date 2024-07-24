import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
} from '@angular/forms';

@Component({
  selector: 'app-custom-property-editor',
  standalone: true,
  templateUrl: './custom-property.component.html',
  styleUrls: ['./custom-property.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class CustomPropertyEditorComponent {
  @Input() set properties(value: any) {
    this.setProperties(value);
  }
  @Output() propertiesChange = new EventEmitter<any>();

  customPropertiesForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.customPropertiesForm = this.fb.group({
      properties: this.fb.array([]),
    });
  }

  get propertiesArray(): FormArray {
    return this.customPropertiesForm.get('properties') as FormArray;
  }

  private setProperties(properties: any): void {
    this.propertiesArray.clear();
    if (properties) {
      Object.keys(properties).forEach((key) => {
        this.propertiesArray.push(
          this.fb.group({
            key: [key],
            value: [properties[key]],
          })
        );
      });
    }
  }

  addProperty(): void {
    this.propertiesArray.push(
      this.fb.group({
        key: [''],
        value: [''],
      })
    );
  }

  removeProperty(index: number): void {
    this.propertiesArray.removeAt(index);
  }

  onPropertyChange(): void {
    const properties = this.propertiesArray.value.reduce(
      (acc: { [key: string]: any }, curr: { key: string; value: any }) => {
        acc[curr.key] = curr.value;
        return acc;
      },
      {}
    );
    this.propertiesChange.emit(properties);
  }
}
