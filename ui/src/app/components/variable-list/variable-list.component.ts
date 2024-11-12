import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TemplateVariable } from '../../models/template.model';

@Component({
  selector: 'app-variable-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-lg shadow-sm border">
      <div class="p-4 border-b">
        <input
          type="text"
          [(ngModel)]="searchTerm"
          (input)="filterVariables()"
          placeholder="Search variables..."
          class="w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
        >
      </div>

      <div class="divide-y">
        @for (variable of filteredVariables; track variable.id) {
          <div class="p-4 hover:bg-gray-50">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-medium text-gray-900">
                  {{ variable.name }}
                </h3>
                <p class="text-sm text-gray-500">
                  Type: {{ variable.type }}
                </p>
                @if (variable.description) {
                  <p class="text-sm text-gray-600 mt-1">
                    {{ variable.description }}
                  </p>
                }
              </div>
              <div class="flex space-x-2">
                <button
                  (click)="editVariable.emit(variable)"
                  class="text-primary-600 hover:text-primary-700">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button
                  (click)="deleteVariable.emit(variable.id)"
                  class="text-red-600 hover:text-red-700">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        } @empty {
          <div class="p-4 text-center text-gray-500">
            No variables found
          </div>
        }
      </div>
    </div>
  `
})
export class VariableListComponent {
  @Input() variables: TemplateVariable[] = [];
  @Output() editVariable = new EventEmitter<TemplateVariable>();
  @Output() deleteVariable = new EventEmitter<string>();

  searchTerm = '';
  filteredVariables: TemplateVariable[] = [];

  ngOnChanges() {
    this.filterVariables();
  }

  filterVariables() {
    if (!this.searchTerm) {
      this.filteredVariables = this.variables;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredVariables = this.variables.filter(variable =>
      variable.name.toLowerCase().includes(term) ||
      variable.description?.toLowerCase().includes(term)
    );
  }
}