import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Template } from '../../models/template.model';
import { TemplateService } from '../../services/template.service';
import { PdfService } from '../../services/pdf.service';
import { SafeHtml } from '@angular/platform-browser';
import { RawViewComponent } from '../raw-view/raw-view.component';

@Component({
  selector: 'app-preview-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, RawViewComponent],
  templateUrl: './preview-panel.component.html',
  styleUrl: './preview-panel.component.scss',
})
export class PreviewPanelComponent implements OnChanges {
  @Input() template!: Template;
  @ViewChild('previewContent') previewContent!: ElementRef;

  showProcessed = true;
  processedContent: SafeHtml = '';
  previewData: Record<string, any> = {};

  constructor(
    private templateService: TemplateService,
    private pdfService: PdfService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['template']) {
      this.initializePreviewData();
      this.updatePreview();
    }
  }

  updateVariableValue(name: string, value: any) {
    this.previewData[name] = value;
    this.updatePreview();
  }

  initializePreviewData() {
    this.previewData = {};
    if (this.template && this.template.variables) {
      this.template.variables.forEach((variable) => {
        if (variable.type === 'array' || variable.type === 'json') {
          try {
            this.previewData[variable.path] = JSON.stringify(
              variable.defaultValue
                ? JSON.parse(variable.defaultValue)
                : variable.type === 'array'
                  ? []
                  : {},
              null,
              2
            );
          } catch {
            this.previewData[variable.path] =
              variable.type === 'array' ? '[]' : '{}';
          }
        } else {
          this.previewData[variable.path] = variable.defaultValue || '';
        }
      });
    }
  }

  updatePreview() {
    if (!this.template.content) {
      this.processedContent = '';
      return;
    }

    if (!this.showProcessed) {
      this.processedContent = this.template.content;
      return;
    }

    try {
      const processedData = { ...this.previewData };

      if (this.template && this.template.variables) {
        this.template.variables.forEach((variable) => {
          if (variable.type === 'array' || variable.type === 'json') {
            try {
              processedData[variable.path] = JSON.parse(
                this.previewData[variable.path]
              );
            } catch {
              processedData[variable.path] =
                variable.type === 'array' ? [] : {};
            }
          }
        });
      }
      this.processedContent = this.templateService.renderTemplate(
        this.template.content,
        processedData
      );
    } catch (error) {
      this.processedContent = `<div class="text-red-600">Template Error: ${error}</div>`;
    }
  }

  resetVariables() {
    this.initializePreviewData();
    this.updatePreview();
  }

  async downloadPDF() {
    if (!this.previewContent) return;

    const filename = `${this.template.name || 'template'}.pdf`;
    try {
      await this.pdfService.generatePDF(
        this.previewContent.nativeElement,
        filename
      );
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }
}
