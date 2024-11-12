import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-json-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative">
      <textarea
        [ngModel]="formattedValue"
        (ngModelChange)="onValueChange($event)"
        rows="5"
        class="w-full px-3 py-2 font-mono text-sm border rounded-md focus:ring-primary-500 focus:border-primary-500"
        [class.border-red-500]="!isValid"
      ></textarea>
      <button
        type="button"
        (click)="formatJson()"
        class="absolute right-2 top-2 text-gray-500 hover:text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  `
})
export class JsonEditorComponent {
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();

  isValid = true;
  formattedValue = '';

  ngOnInit() {
    this.formatJson();
  }

  ngOnChanges() {
    this.formatJson();
  }

  onValueChange(value: string) {
    try {
      JSON.parse(value);
      this.isValid = true;
      this.valueChange.emit(value);
    } catch {
      this.isValid = false;
    }
  }

  formatJson() {
    try {
      const parsed = JSON.parse(this.value || '{}');
      this.formattedValue = JSON.stringify(parsed, null, 2);
      this.isValid = true;
    } catch {
      this.formattedValue = this.value;
      this.isValid = false;
    }
  }
}