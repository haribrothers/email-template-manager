import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Editor } from '@tiptap/core';

@Component({
  selector: 'app-text-floating-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center bg-white border rounded-lg shadow-lg p-2 gap-2">
      <div class="flex">
        <button
          class="editor-button"
          [class.active]="editor?.isActive('bold')"
          (click)="toggleBold()">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 11H12.5C13.8807 11 15 9.88071 15 8.5C15 7.11929 13.8807 6 12.5 6H8V11ZM18 15.5C18 17.9853 15.9853 20 13.5 20H6V4H12.5C14.9853 4 17 6.01472 17 8.5C17 9.70431 16.5269 10.7981 15.7564 11.6058C17.0979 12.3847 18 13.837 18 15.5ZM8 13V18H13.5C14.8807 18 16 16.8807 16 15.5C16 14.1193 14.8807 13 13.5 13H8Z"></path>
          </svg>
        </button>
        <button
          class="editor-button"
          [class.active]="editor?.isActive('italic')"
          (click)="toggleItalic()">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15 20H7V18H9.92661L12.0425 6H9V4H17V6H14.0734L11.9575 18H15V20Z"></path>
          </svg>
        </button>
        <button
          class="editor-button"
          [class.active]="editor?.isActive('underline')"
          (click)="toggleUnderline()">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 3V12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12V3H18V12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12V3H8ZM4 20H20V22H4V20Z"></path>
          </svg>
        </button>
      </div>
      <div class="w-px h-4 bg-gray-300"></div>
      <div class="flex">
        <button
          class="editor-button"
          [class.active]="editor?.isActive('heading', { level: 1 })"
          (click)="toggleHeading(1)">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 20H11V13H4V20H2V4H4V11H11V4H13V20Z"></path>
          </svg>
        </button>
        <button
          class="editor-button"
          [class.active]="editor?.isActive('heading', { level: 2 })"
          (click)="toggleHeading(2)">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 4V11H11V4H13V20H11V13H4V20H2V4H4Z"></path>
          </svg>
        </button>
      </div>
    </div>
  `
})
export class TextFloatingMenuComponent {
  @Input() editor: Editor | null = null;

  toggleBold() {
    this.editor?.chain().focus().toggleBold().run();
  }

  toggleItalic() {
    this.editor?.chain().focus().toggleItalic().run();
  }

  toggleUnderline() {
    this.editor?.chain().focus().toggleUnderline().run();
  }

  toggleHeading(level: 1 | 2) {
    this.editor?.chain().focus().toggleHeading({ level }).run();
  }
}