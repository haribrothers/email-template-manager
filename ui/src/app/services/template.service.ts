import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Template, TemplateVariable } from '../models/template.model';
import { VariableService } from './variable.service';
import { PartialService } from './partial.service';
import * as Handlebars from 'handlebars';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private templates = new BehaviorSubject<Template[]>([]);
  private selectedTemplateId = new BehaviorSubject<string | null>(null);
  private apiUrl = 'http://localhost:3000/api';

  templates$ = this.templates.asObservable();
  selectedId$ = this.selectedTemplateId.asObservable();
  selectedTemplate$ = this.selectedId$.pipe(
    map(id => {
      const template = this.templates.getValue().find(t => t.id === id);
      if (template) {
        const variables = this.variableService.getAllVariables();
        return {
          ...template,
          variables
        };
      }
      return null;
    })
  );

  constructor(
    private variableService: VariableService,
    private partialService: PartialService,
    private sanitizer: DomSanitizer
  ) {
    // Load templates from storage
    const savedTemplates = localStorage.getItem('templates');
    if (savedTemplates) {
      this.templates.next(JSON.parse(savedTemplates));
    }

    // Register all partials with Handlebars
    this.registerPartials();

    // Subscribe to partial changes to update registrations
    this.partialService.partials$.subscribe(() => {
      this.registerPartials();
    });
  }


  private registerPartials() {
    // Unregister all existing partials
    const partialNames = Object.keys(Handlebars.partials);
    partialNames.forEach(name => {
      Handlebars.unregisterPartial(name);
    });
    
    const partials = this.partialService.getPartials();
    partials.forEach(partial => {
      // Register each partial with Handlebars
      // The name must not contain spaces or special characters
      const safeName = partial.name.replace(/[^a-zA-Z0-9]/g, '_');
      Handlebars.registerPartial(safeName, partial.content);
    });
  }

  private saveToStorage(templates: Template[]) {
    localStorage.setItem('templates', JSON.stringify(templates));
  }

  addTemplate(template: Template) {
    const current = this.templates.getValue();
    const updated = [...current, template];
    this.templates.next(updated);
    this.saveToStorage(updated);
    this.selectedTemplateId.next(template.id);
  }

  updateTemplate(template: Template) {
    const current = this.templates.getValue();
    const updated = current.map(t => t.id === template.id ? template : t);
    this.templates.next(updated);
    this.selectedTemplateId.next(template.id);
    this.saveToStorage(updated);
  }

  deleteTemplate(id: string) {
    const current = this.templates.getValue();
    const updated = current.filter(t => t.id !== id);
    this.templates.next(updated);
    this.saveToStorage(updated);
    if (this.selectedTemplateId.getValue() === id) {
      this.selectedTemplateId.next(null);
    }
  }

  selectTemplate(id: string) {
    this.selectedTemplateId.next(id);
  }

  // Helper method to compile and render a template with partials
  renderTemplate(content: string, data: any = {}): SafeHtml {
    try {
      const template = Handlebars.compile(content);
      const rendered = template(data);
      // Bypass security and trust the HTML content
      return this.sanitizer.bypassSecurityTrustHtml(rendered);
    } catch (error) {
      console.error('Template rendering error:', error);
      return this.sanitizer.bypassSecurityTrustHtml(`Error rendering template: ${error}`);
    }
  }
}