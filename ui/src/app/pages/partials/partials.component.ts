import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from '../../components/editor/editor.component';
import { PartialService, TemplatePartial } from '../../services/partial.service';

@Component({
  selector: 'app-partials',
  standalone: true,
  imports: [CommonModule, EditorComponent],
  template: `
    <div class="flex h-screen">
      <!-- Partials List -->
      <div class="w-64 border-r bg-white p-4">
        <div class="mb-4">
          <button class="w-full bg-primary-600 text-white px-4 py-2 rounded"
            (click)="createPartial()">
            New Partial
          </button>
        </div>
        
        <div class="space-y-2">
          @for (partial of partials$ | async; track partial.id) {
            <div class="p-2 hover:bg-gray-100 cursor-pointer rounded"
              [class.bg-primary-50]="partial.id === selectedPartial?.id"
              (click)="selectPartial(partial)">
              <div class="font-medium">{{ partial.name || 'Untitled Partial' }}</div>
              @if (partial.category) {
                <div class="text-xs text-gray-500">{{ partial.category }}</div>
              }
            </div>
          }
        </div>
      </div>

      <!-- Editor -->
      <div class="flex-1 flex flex-col">
        @if (selectedPartial) {
          <div class="p-4 border-b bg-white">
            <div class="mb-4">
              <input 
                type="text" 
                [value]="selectedPartial.name"
                (input)="updatePartialName($event)"
                class="w-full px-4 py-2 border rounded"
                placeholder="Partial Name"
              >
            </div>
            <div class="flex gap-4">
              <input 
                type="text" 
                [value]="selectedPartial.category"
                (input)="updatePartialCategory($event)"
                class="flex-1 px-4 py-2 border rounded"
                placeholder="Category (optional)"
              >
              <button 
                class="px-4 py-2 bg-primary-100 text-primary-700 rounded hover:bg-primary-200"
                (click)="copyPartialReference()">
                Copy Reference
              </button>
            </div>
            <div class="mt-4">
              <textarea
                [value]="selectedPartial.description"
                (input)="updatePartialDescription($event)"
                class="w-full px-4 py-2 border rounded"
                rows="2"
                placeholder="Description (optional)"
              ></textarea>
            </div>
          </div>
          <div class="flex-1 p-4 min-h-0">
            <app-editor 
              [content]="selectedPartial.content"
              (contentChange)="updatePartialContent($event)"
            />
          </div>
        } @else {
          <div class="flex-1 flex items-center justify-center text-gray-500">
            Select a partial or create a new one to start editing
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class PartialsComponent {
  partials$ = this.partialService.partials$;
  selectedPartial: TemplatePartial | null = null;

  constructor(private partialService: PartialService) {}

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
    
    // Create the Handlebars partial reference
    const reference = `{{> ${this.selectedPartial.name}}}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(reference).then(() => {
      // You could add a toast notification here
      console.log('Partial reference copied to clipboard');
    });
  }
}