import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Editor } from '@tiptap/core';

type ImageSize = 'small' | 'medium' | 'large';

interface SizeOption {
  label: string;
  value: ImageSize;
}

@Component({
  selector: 'app-image-floating-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center bg-white border rounded-lg shadow-lg p-2 gap-2">
      @for (size of sizes; track size.value) {
        <button
          class="px-3 py-1 rounded text-sm"
          [class.bg-primary-100]="editor?.isActive('image', { size: size.value })"
          [class.text-primary-700]="editor?.isActive('image', { size: size.value })"
          [class.border-primary-300]="editor?.isActive('image', { size: size.value })"
          [class.border]="editor?.isActive('image', { size: size.value })"
          (click)="setImageSize(size.value)">
          {{ size.label }}
        </button>
      }
    </div>
  `
})
export class ImageFloatingMenuComponent {
  @Input() editor: Editor | null = null;

  sizes: SizeOption[] = [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' }
  ];

  setImageSize(size: ImageSize) {
    if (this.editor) {
      this.editor.chain().focus().setImageSize(size).run();
    }
  }
}