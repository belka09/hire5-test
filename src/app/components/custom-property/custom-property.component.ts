import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';

@Component({
  selector: 'app-custom-property-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './custom-property.component.html',
})
export class CustomPropertyEditorComponent implements OnInit, OnChanges {
  @Input() properties: { [key: string]: string } = {};
  @Output() propertiesChange = new EventEmitter<{ [key: string]: string }>();

  formGroup!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['properties']) {
      this.initializeForm();
    }
  }

  initializeForm(): void {
    this.formGroup = this.fb.group({
      properties: this.fb.array([]),
    });

    if (this.properties) {
      Object.keys(this.properties).forEach((key) => {
        this.addProperty(key, this.properties[key]);
      });
    }

    this.formGroup.valueChanges.subscribe((value) => {
      const updatedProperties: { [key: string]: string } = {};
      value.properties.forEach((property: { key: string; value: string }) => {
        updatedProperties[property.key] = property.value;
      });
      this.propertiesChange.emit(updatedProperties);
    });
  }

  get propertiesArray(): FormArray {
    return this.formGroup.get('properties') as FormArray;
  }

  addProperty(key: string = '', value: string = ''): void {
    this.propertiesArray.push(
      this.fb.group({
        key: [key],
        value: [value],
      })
    );
  }

  removeProperty(index: number): void {
    this.propertiesArray.removeAt(index);
  }
}
