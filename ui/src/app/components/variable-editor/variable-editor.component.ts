import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { TemplateVariable } from '../../models/template.model';
import { VariableService } from '../../services/variable.service';
import { MonacoJsonEditorComponent } from '../monaco-json-editor/monaco-json-editor.component';

@Component({
  selector: 'app-variable-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MonacoJsonEditorComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          type="text"
          formControlName="name"
          class="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
          [class.border-red-500]="form.get('name')?.invalid && form.get('name')?.touched"
        >
        @if (form.get('name')?.invalid && form.get('name')?.touched) {
          <p class="mt-1 text-sm text-red-500">Name is required</p>
        }
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Path
        </label>
        <input
          type="text"
          formControlName="path"
          class="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
          [class.border-red-500]="form.get('path')?.invalid && form.get('path')?.touched"
        >
        @if (form.get('path')?.invalid && form.get('path')?.touched) {
          <p class="mt-1 text-sm text-red-500">Path is required</p>
        }
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Type
        </label>
        <select
          formControlName="type"
          class="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
          (change)="onTypeChange()">
          <option value="string">String</option>
          <option value="array">Array</option>
          <option value="json">JSON Object</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Default Value
        </label>
        @if (form.get('type')?.value === 'string') {
          <input
            type="text"
            formControlName="defaultValue"
            class="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
          >
        } @else {
          <app-monaco-json-editor
            [value]="form.get('defaultValue')?.value"
            (valueChange)="onDefaultValueChange($event)"
          />
        }
        @if (validationError) {
          <p class="mt-1 text-sm text-red-500">{{ validationError }}</p>
        }
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          formControlName="description"
          rows="3"
          class="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
        ></textarea>
      </div>

      <div class="flex items-center">
        <input
          type="checkbox"
          formControlName="required"
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        >
        <label class="ml-2 block text-sm text-gray-700">
          Required
        </label>
      </div>

      <div class="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          (click)="cancel.emit()"
          class="px-4 py-2 border rounded-md hover:bg-gray-50">
          Cancel
        </button>
        <button
          type="submit"
          [disabled]="!form.valid || validationError"
          class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50">
          Save Variable
        </button>
      </div>
    </form>
  `,
})
export class VariableEditorComponent implements OnInit {
  @Input() variable: TemplateVariable | null = null;
  @Output() save = new EventEmitter<TemplateVariable>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  validationError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private variableService: VariableService
  ) {
    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      path: ['', Validators.required],
      type: ['string'],
      defaultValue: [''],
      description: [''],
      required: [true],
    });
  }

  ngOnInit() {
    if (this.variable) {
      this.form.patchValue(this.variable);
    }
  }

  onTypeChange() {
    const type = this.form.get('type')?.value;
    const currentValue = this.form.get('defaultValue')?.value;

    if (type === 'string') {
      this.form.patchValue({ defaultValue: '' });
    } else {
      try {
        JSON.parse(currentValue);
      } catch {
        const defaultValue = type === 'array' ? '[]' : '{}';
        this.form.patchValue({ defaultValue });
      }
    }
    this.validateDefaultValue();
  }

  onDefaultValueChange(value: string) {
    this.form.patchValue({ defaultValue: value });
    this.validateDefaultValue();
  }

  validateDefaultValue() {
    const type = this.form.get('type')?.value;
    const value = this.form.get('defaultValue')?.value;

    const validation = this.variableService.validateValue(value, type);
    this.validationError = validation.error || null;
  }

  onSubmit() {
    if (this.form.valid && !this.validationError) {
      this.save.emit(this.form.value);
    }
  }
}
