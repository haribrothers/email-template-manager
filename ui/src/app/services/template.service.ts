import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Template, TemplateVariable } from '../models/template.model';
import { VariableService } from './variable.service';
import { PartialService } from './partial.service';
import { ObjectPathService } from './object-path.service';
import * as Handlebars from 'handlebars';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private templates = new BehaviorSubject<Template[]>([]);
  private selectedTemplateId = new BehaviorSubject<string | null>(null);

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
    private objectPathService: ObjectPathService,
    private sanitizer: DomSanitizer
  ) {
    const savedTemplates = localStorage.getItem('templates');
    if (savedTemplates) {
      this.templates.next(JSON.parse(savedTemplates));
    }

    this.registerPartials();
    this.partialService.partials$.subscribe(() => {
      this.registerPartials();
    });
  }

  private registerPartials() {
    const partialNames = Object.keys(Handlebars.partials);
    partialNames.forEach(name => {
      Handlebars.unregisterPartial(name);
    });

    const partials = this.partialService.getPartials();
    partials.forEach(partial => {
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

  renderTemplate(content: string, data: any = {}): SafeHtml {
    try {
      const nestedData = this.objectPathService.convertToNestedObject(data);
      console.log('Original data:', data);
      console.log('Nested data:', nestedData);

      const template = Handlebars.compile(content);
      const rendered = template(nestedData);
      return this.sanitizer.bypassSecurityTrustHtml(rendered);
    } catch (error) {
      console.error('Template rendering error:', error);
      return this.sanitizer.bypassSecurityTrustHtml(`Error rendering template: ${error}`);
    }
  }
}