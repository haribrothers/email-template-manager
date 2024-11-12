import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditorComponent } from '../editor/editor.component';
import { Template } from '../../models/template.model';
import { TemplateService } from '../../services/template.service';
import * as Handlebars from 'handlebars';

@Component({
  selector: 'app-template-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, EditorComponent],
  template: `
    <div class="template-editor">
      <div class="editor-header">
        <input 
          type="text" 
          [(ngModel)]="template.name" 
          placeholder="Template Name"
          class="template-name"
        >
        <input 
          type="text" 
          [(ngModel)]="template.category" 
          placeholder="Category"
          class="template-category"
        >
      </div>

      <div class="editor-container">
        <div class="edit-section">
          <h3>Editor</h3>
          <app-editor 
            [content]="template.content"
            (contentChange)="onContentChange($event)">
          </app-editor>
        </div>

        <div class="preview-section">
          <h3>Preview</h3>
          <div class="preview-controls">
            <button (click)="togglePreviewMode()">
              {{ showProcessed ? 'Show Raw' : 'Show Processed' }}
            </button>
            <button (click)="refreshPreview()">Refresh Preview</button>
          </div>
          <div 
            class="preview-content"
            [innerHTML]="previewContent">
          </div>
        </div>
      </div>

      <div class="variables-section">
        <h3>Template Variables</h3>
        <div class="variable-list">
          <div *ngFor="let variable of template.variables; let i = index" class="variable-item">
            <input 
              [(ngModel)]="variable.name" 
              placeholder="Variable name"
            >
            <select [(ngModel)]="variable.type">
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="array">Array</option>
            </select>
            <input 
              [(ngModel)]="variable.defaultValue" 
              placeholder="Default value"
            >
            <button (click)="removeVariable(i)" class="remove-btn">Remove</button>
          </div>
          <button (click)="addVariable()" class="add-btn">Add Variable</button>
        </div>
      </div>

      <div class="actions">
        <button (click)="saveTemplate()" class="save-btn">Save Template</button>
        <button (click)="cancel()" class="cancel-btn">Cancel</button>
      </div>
    </div>
  `,
  styles: [`
    .template-editor {
      padding: 20px;
    }
    .editor-header {
      margin-bottom: 20px;
      display: flex;
      gap: 16px;
    }
    .template-name, .template-category {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .editor-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }
    .edit-section, .preview-section {
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 16px;
    }
    .preview-controls {
      margin-bottom: 16px;
      display: flex;
      gap: 8px;
    }
    .preview-content {
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 16px;
      min-height: 300px;
      background: white;
    }
    .variables-section {
      margin-top: 20px;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 16px;
    }
    .variable-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .variable-item {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .actions {
      margin-top: 20px;
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
    .save-btn {
      background: #28a745;
    }
    .cancel-btn {
      background: #dc3545;
    }
    .remove-btn {
      background: #dc3545;
      padding: 4px 8px;
    }
    .add-btn {
      background: #28a745;
      align-self: flex-start;
    }
  `]
})
export class TemplateEditorComponent implements OnInit {
  @Input() templateId?: string;

  template: Template = {
    id: crypto.randomUUID(),
    name: '',
    category: '',
    content: '',
    variables: [],
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  showProcessed = false;
  previewContent = '';

  constructor(private templateService: TemplateService) {}

  ngOnInit() {
    if (this.templateId) {
      const existingTemplate = this.templateService.getTemplateById(this.templateId);
      if (existingTemplate) {
        this.template = { ...existingTemplate };
      }
    }
    this.refreshPreview();
  }

  onContentChange(content: string) {
    this.template.content = content;
    this.refreshPreview();
  }

  togglePreviewMode() {
    this.showProcessed = !this.showProcessed;
    this.refreshPreview();
  }

  refreshPreview() {
    if (this.showProcessed) {
      try {
        const template = Handlebars.compile(this.template.content);
        const previewData = this.generatePreviewData();
        this.previewContent = template(previewData);
      } catch (error) {
        this.previewContent = `<div class="error">Template Error: ${error}</div>`;
      }
    } else {
      this.previewContent = this.template.content;
    }
  }

  generatePreviewData() {
    return this.template.variables.reduce((acc, variable) => {
      acc[variable.name] = variable.defaultValue || this.getDefaultValueForType(variable.type);
      return acc;
    }, {} as Record<string, any>);
  }

  getDefaultValueForType(type: string) {
    switch (type) {
      case 'string': return 'Sample Text';
      case 'number': return 42;
      case 'boolean': return true;
      case 'array': return ['Item 1', 'Item 2'];
      default: return null;
    }
  }

  addVariable() {
    this.template.variables.push({
      name: '',
      type: 'string',
      required: true
    });
  }

  removeVariable(index: number) {
    this.template.variables.splice(index, 1);
  }

  saveTemplate() {
    this.template.updatedAt = new Date();
    if (this.templateId) {
      this.templateService.updateTemplate(this.template);
    } else {
      this.templateService.addTemplate(this.template);
    }
  }

  cancel() {
    // Implement navigation back to list
  }
}