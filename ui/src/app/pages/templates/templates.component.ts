import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from '../../components/editor/editor.component';
import { PreviewPanelComponent } from '../../components/preview-panel/preview-panel.component';
import { Template } from '../../models/template.model';
import { TemplateService } from '../../services/template.service';
import { VariableService } from '../../services/variable.service';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule, EditorComponent, PreviewPanelComponent],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss'
})
export class TemplatesComponent implements OnInit {
  templates$ = this.templateService.templates$;
  selectedId$ = this.templateService.selectedId$;
  selectedTemplate$ = this.templateService.selectedTemplate$;
  showPreview = false;

  constructor(
    private readonly templateService: TemplateService,
    private readonly variableService: VariableService
  ) {}

  ngOnInit() {
    this.variableService.loadVariables();
  }

  createTemplate() {
    const template: Template = {
      id: crypto.randomUUID(),
      name: 'Untitled Template',
      content: '',
      variables: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.templateService.addTemplate(template);
  }

  selectTemplate(id: string) {
    this.templateService.selectTemplate(id);
  }

  updateTemplateName(event: Event, template: Template) {
    const name = (event.target as HTMLInputElement).value;
    this.updateTemplate({
      ...template,
      name
    });
  }

  updateTemplateContent(content: string, template: Template) {
    this.updateTemplate({
      ...template,
      content
    });
  }

  private updateTemplate(template: Template) {
    this.templateService.updateTemplate({
      ...template,
      updatedAt: new Date()
    });
  }
}