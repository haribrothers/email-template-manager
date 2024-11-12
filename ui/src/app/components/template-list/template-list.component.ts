import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Template } from '../../models/template.model';
import { TemplateService } from '../../services/template.service';

@Component({
  selector: 'app-template-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="template-list">
      <div class="filters">
        <input 
          type="text" 
          placeholder="Search templates..."
          (input)="onSearch($event)"
          class="search-input"
        >
        <select (change)="onCategoryFilter($event)" class="category-filter">
          <option value="">All Categories</option>
          <option *ngFor="let category of categories">{{category}}</option>
        </select>
      </div>

      <div class="templates">
        <div *ngFor="let template of filteredTemplates" class="template-card">
          <h3>{{template.name}}</h3>
          <p>Category: {{template.category}}</p>
          <p>Last updated: {{template.updatedAt | date}}</p>
          <div class="actions">
            <button (click)="editTemplate.emit(template.id)">Edit</button>
            <button (click)="deleteTemplate(template.id)">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .template-list {
      padding: 20px;
    }
    .filters {
      margin-bottom: 20px;
      display: flex;
      gap: 10px;
    }
    .search-input, .category-filter {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .template-card {
      border: 1px solid #eee;
      padding: 15px;
      margin-bottom: 10px;
      border-radius: 4px;
    }
    .actions {
      display: flex;
      gap: 10px;
    }
  `]
})
export class TemplateListComponent {
  @Output() editTemplate = new EventEmitter<string>();

  templates: Template[] = [];
  filteredTemplates: Template[] = [];
  categories: string[] = [];

  constructor(private templateService: TemplateService) {
    this.templateService.getTemplates().subscribe(templates => {
      this.templates = templates;
      this.filteredTemplates = templates;
      this.categories = [...new Set(templates.map(t => t.category))];
    });
  }

  onSearch(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filterTemplates(searchTerm);
  }

  onCategoryFilter(event: Event) {
    const category = (event.target as HTMLSelectElement).value;
    this.filterTemplates('', category);
  }

  private filterTemplates(searchTerm: string = '', category: string = '') {
    this.filteredTemplates = this.templates.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm);
      const matchesCategory = !category || template.category === category;
      return matchesSearch && matchesCategory;
    });
  }

  deleteTemplate(id: string) {
    if (confirm('Are you sure you want to delete this template?')) {
      this.templateService.deleteTemplate(id);
    }
  }
}