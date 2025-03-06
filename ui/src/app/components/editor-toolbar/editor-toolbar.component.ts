import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Editor } from '@tiptap/core';
import { PartialService } from '../../services/partial.service';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { FormsModule } from '@angular/forms';
import { VariableService } from '../../services/variable.service';
import { HandlebarsHelperService } from '../../services/handlebars-helper.service';
import { TemplatePartial, TemplateVariable } from '../../models/template.model';

interface TextStyleAttributes {
  [key: string]: any;
  fontFamily?: string;
  fontSize?: string;
}

@Component({
  selector: 'app-editor-toolbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editor-toolbar.component.html',
  styleUrl: './editor-toolbar.component.scss',
})
export class EditorToolbarComponent {
  @Input() editor: Editor | null = null;

  partials: TemplatePartial[] = [];
  variables: TemplateVariable[] = [];
  blockHelpers = this.handlebarsHelperService.getBlockHelpers();

  @ViewChild('colorPicker') colorPicker!: ElementRef;
  showColorPicker = false;
  selectedColor = '#000000';

  fontFamilies = [
    { label: 'Arial', value: 'Arial' },
    { label: 'Times New Roman', value: 'Times New Roman' },
    { label: 'Courier New', value: 'Courier New' },
    { label: 'Georgia', value: 'Georgia' },
    { label: 'Verdana', value: 'Verdana' },
    { label: 'Helvetica', value: 'Helvetica' },
  ];

  fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];

  constructor(
    private partialService: PartialService,
    private variableService: VariableService,
    private handlebarsHelperService: HandlebarsHelperService
  ) {
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
    if (this.editor) {
      this.editor.chain().focus().setColor(color).run();
    }
  }

  setFontFamily(event: Event) {
    const fontFamily = (event.target as HTMLSelectElement).value;
    if (this.editor) {
      this.editor.chain().focus().setFontFamily(fontFamily).run();
    }
  }

  setFontSize(event: Event) {
    const fontSize = (event.target as HTMLSelectElement).value;
    if (fontSize && this.editor) {
      this.editor.chain().focus().setFontSize(`${fontSize}px`).run();
    } else if (this.editor) {
      this.editor.chain().focus().unsetFontSize().run();
    }
  }

  getCurrentFont(): string {
    const attrs = this.editor?.getAttributes(
      'textStyle'
    ) as TextStyleAttributes;
    return attrs?.['fontFamily'] || '';
  }

  getCurrentFontSize(): string {
    const attrs = this.editor?.getAttributes(
      'textStyle'
    ) as TextStyleAttributes;
    const fontSize = attrs?.['fontSize'];
    return fontSize ? fontSize.replace('px', '') : '';
  }

  toggleBulletList() {
    this.editor?.chain().focus().toggleBulletList().run();
  }

  toggleOrderedList() {
    this.editor?.chain().focus().toggleOrderedList().run();
  }

  insertLink() {
    const url = window.prompt('URL:');
    if (url && this.editor) {
      this.editor.chain().focus().setLink({ href: url }).run();
    }
  }

  insertImage() {
    const url = window.prompt('Image URL:');
    if (url && this.editor) {
      this.editor.chain().focus().setImage({ src: url }).run();
    }
  }

  insertTable() {
    if (this.editor) {
      this.editor
        .chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run();
    }
  }

  setImageSize(size: 'small' | 'medium' | 'large') {
    if (this.editor?.isActive('image')) {
      this.editor.chain().focus().setImageSize(size).run();
    }
  }

  toggleNonEditable() {
    if (this.editor) {
      if (this.editor.isActive('textStyle', { editable: false })) {
        this.editor.chain().focus().unsetNonEditable().run();
      } else {
        this.editor.chain().focus().setNonEditable().run();
      }
    }
  }

  insertPartial(event: Event) {
    const select = event.target as HTMLSelectElement;
    const selectedPartial = select.value;
    const selectedName = this.partials.find(
      (p) => p.id === selectedPartial
    )?.name;
    if (this.editor && selectedName) {
      this.editor.chain().focus().insertContent(`{{> ${selectedName}}}`).run();
    }
    select.value = '';
  }

  insertVariable(event: Event) {
    const select = event.target as HTMLSelectElement;
    const selectedVariable = select.value;
    const variable = this.variables.find((v) => v.id === selectedVariable);

    if (!this.editor || !variable) return;

    let template = '';

    try {
      let defaultValue: any;

      switch (variable.type) {
        case 'array':
        case 'json':
          defaultValue = JSON.parse(
            variable.defaultValue || (variable.type === 'array' ? '[]' : '{}')
          );
          template = this.handlebarsHelperService.generateTemplate(
            defaultValue,
            variable.path
          );
          break;
        default:
          template = `{{${variable.path}}}`;
      }

      this.editor.chain().focus().insertContent(template).run();
    } catch (e) {
      console.warn('Error parsing variable default value:', e);
      template =
        variable.type === 'array'
          ? `{{#each ${variable.path}}}\n  {{this}}\n{{/each}}`
          : `{{${variable.path}}}`;
      this.editor.chain().focus().insertContent(template).run();
    }

    select.value = '';
  }

  insertBlockHelper(event: Event) {
    const select = event.target as HTMLSelectElement;
    const selectedHelper = select.value;
    const helper = this.blockHelpers.find((h) => h.id === selectedHelper);
    if (this.editor && helper) {
      this.editor.chain().focus().insertContent(helper.template).run();
    }
    select.value = '';
  }

  toggleColorPicker() {
    this.colorPicker.nativeElement.click();
    this.showColorPicker = !this.showColorPicker;
  }
}
