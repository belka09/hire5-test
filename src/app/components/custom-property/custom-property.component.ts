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
export class CustomPropertyEditorComponent {}
