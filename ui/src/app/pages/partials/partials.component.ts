import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from '../../components/editor/editor.component';
import { PartialService } from '../../services/partial.service';
import { TemplatePartial } from 'src/app/models/template.model';

@Component({
  selector: 'app-partials',
  standalone: true,
  imports: [CommonModule, EditorComponent],
  templateUrl: './partials.component.html',
  styleUrl: './partials.component.scss'
})
export class PartialsComponent {
  partials$ = this.partialService.partials$;
  selectedPartial: TemplatePartial | null = null;

  constructor(private partialService: PartialService) { }

  createPartial() {
    const partial: TemplatePartial = {
      id: crypto.randomUUID(),
      name: 'Untitled Partial',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.partialService.addPartial(partial);
    this.selectPartial(partial);
  }

  selectPartial(partial: TemplatePartial) {
    this.selectedPartial = { ...partial };
  }

  deletePartial(id: string) {
    if (confirm('Are you sure you want to delete this partial?')) {
      this.partialService.deletePartial(id);
      if (this.selectedPartial?.id === id) {
        this.selectedPartial = null;
      }
    }
  }

  updatePartialName(event: Event) {
    if (!this.selectedPartial) return;
    const name = (event.target as HTMLInputElement).value;
    this.updatePartial({ name });
  }

  updatePartialCategory(event: Event) {
    if (!this.selectedPartial) return;
    const category = (event.target as HTMLInputElement).value;
    this.updatePartial({ category });
  }

  updatePartialDescription(event: Event) {
    if (!this.selectedPartial) return;
    const description = (event.target as HTMLTextAreaElement).value;
    this.updatePartial({ description });
  }

  updatePartialContent(content: string) {
    if (!this.selectedPartial) return;
    this.updatePartial({ content });
  }

  private updatePartial(updates: Partial<TemplatePartial>) {
    if (!this.selectedPartial) return;

    const updated: TemplatePartial = {
      ...this.selectedPartial,
      ...updates,
      updatedAt: new Date()
    };

    this.selectedPartial = updated;
    this.partialService.updatePartial(updated);
  }

  copyPartialReference() {
    if (!this.selectedPartial) return;

    const reference = `{{> ${this.selectedPartial.name}}}`;

    navigator.clipboard.writeText(reference).then(() => {
      console.log('Partial reference copied to clipboard');
    });
  }
}