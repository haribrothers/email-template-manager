import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Editor } from '@tiptap/core';
import { PartialService } from '../../services/partial.service';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { FormsModule } from '@angular/forms';
import { VariableService } from 'src/app/services/variable.service';
import { TemplatePartial, TemplateVariable } from 'src/app/models/template.model';

@Component({
  selector: 'app-editor-toolbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editor-toolbar.component.html',
  styleUrl: './editor-toolbar.component.scss'
})
export class EditorToolbarComponent {
  @Input() editor: Editor | null = null;

  partials: TemplatePartial[] = [];
  variables: TemplateVariable[] = [];

  @ViewChild('colorPicker') colorPicker!: ElementRef;
  showColorPicker = false;
  selectedColor = '#000000';

  fontFamilies = [
    { label: 'Arial', value: 'Arial' },
    { label: 'Times New Roman', value: 'Times New Roman' },
    { label: 'Courier New', value: 'Courier New' },
    { label: 'Georgia', value: 'Georgia' },
    { label: 'Verdana', value: 'Verdana' },
    { label: 'Helvetica', value: 'Helvetica' }
  ];

  fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];

  constructor(private partialService: PartialService, private variableService: VariableService) {
    this.partials = partialService.getPartials();
    this.variables = variableService.getAllVariables();
  }

  toggleBold() {
    this.editor?.chain().focus().toggleBold().run();
  }

  toggleItalic() {
    this.editor?.chain().focus().toggleItalic().run();
  }

  toggleUnderline() {
    this.editor?.chain().focus().toggleUnderline().run();
  }

  toggleStrikethrough() {
    this.editor?.chain().focus().toggleStrike().run();
  }

  toggleAlign(alignment: 'left' | 'center' | 'right') {
    this.editor?.chain().focus().setTextAlign(alignment).run();
  }

  toggleHeading(level: 1 | 2) {
    this.editor?.chain().focus().toggleHeading({ level }).run();
  }

  setColor(event: Event) {
    const color = (event.target as HTMLInputElement).value;
    this.selectedColor = color;
    console.log('color', color)
    this.editor?.chain().focus().setColor(color).run();
  }

  setFontFamily(event: Event) {
    const fontFamily = (event.target as HTMLSelectElement).value;
    this.editor?.chain().focus().setFontFamily(fontFamily).run();
  }

  setFontSize(event: Event) {
    const fontSize = (event.target as HTMLSelectElement).value;
    if (fontSize) {
      this.editor?.chain().focus().setFontSize(`${fontSize}px`).run();
    } else {
      this.editor?.chain().focus().unsetFontSize().run();
    }
  }

  getCurrentFont(): string {
    const attrs = this.editor?.getAttributes('textStyle') as Record<string, any>;
    return attrs?.['fontFamily'] || '';
  }

  getCurrentFontSize(): string {
    const attrs = this.editor?.getAttributes('textStyle') as Record<string, any>;
    if (attrs?.['fontSize']) {
      return attrs['fontSize'].replace('px', '');
    }
    return '';
  }

  toggleBulletList() {
    this.editor?.chain().focus().toggleBulletList().run();
  }

  toggleOrderedList() {
    this.editor?.chain().focus().toggleOrderedList().run();
  }

  insertLink() {
    const url = window.prompt('URL:');
    if (url) {
      this.editor?.chain().focus().setLink({ href: url }).run();
    }
  }

  insertImage() {
    const url = window.prompt('Image URL:');
    if (url) {
      this.editor?.chain().focus().setImage({ src: url }).run();
    }
  }

  insertTable() {
    this.editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }

  insertPartials() {
    const partials = this.partialService.getPartials();
    const variables = this.variableService.getAllVariables();
    if (partials.length === 0) {
      alert('No partials available. Create some partials first.');
      return;
    }

    const partialList = partials
      .map(p => `${p.name}${p.category ? ` (${p.category})` : ''}`)
      .join('\n');
    
    const selectedName = window.prompt(
      `Available partials:\n\n${partialList}\n\nEnter partial name:`,
      partials[0].name
    );

    if (selectedName && partials.find(p => p.name === selectedName)) {
      this.editor?.chain().focus().insertContent(`{{> ${selectedName}}}`).run();
    }
  }

  toggleColorPicker() {
    this.colorPicker.nativeElement.click();
    this.showColorPicker = !this.showColorPicker;
  }

  insertPartial(event: Event) {
    const select = event.target as HTMLSelectElement
    const selectedPartial = select.value;
    const selectedName = this.partials.find(p => p.id === selectedPartial)?.name;
    this.editor?.chain().focus().insertContent(`{{> ${selectedName}}}`).run();
    select.value = '';
  }

  insertVariable(event: Event) {
    const select = event.target as HTMLSelectElement
    const selectedVariable = select.value;
    const selectedName = this.variables.find(p => p.id === selectedVariable)?.name;
    this.editor?.chain().focus().insertContent(`{{${selectedName}}}`).run();
    select.value = '';
  }
}