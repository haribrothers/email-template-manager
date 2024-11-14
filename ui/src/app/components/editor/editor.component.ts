import { Component, ViewChild, ElementRef, AfterViewInit, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

// TipTap editor and extensions
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align'

import { FontSize } from './fontsize.extension';
import { EditorToolbarComponent } from '../editor-toolbar/editor-toolbar.component';



@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, EditorToolbarComponent],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('editorElement') editorElement!: ElementRef;
  @Input() content = '';
  @Output() contentChange = new EventEmitter<string>();

  editor: Editor | null = null;
  private skipNextUpdate = false;

  private defaultStyles = {
    paragraph: 'margin: 1em 0; line-height: 1.5;',
    heading1: 'font-size: 2em; margin: 0.67em 0; font-weight: bold;',
    heading2: 'font-size: 1.5em; margin: 0.83em 0; font-weight: bold;',
    heading3: 'font-size: 1.17em; margin: 1em 0; font-weight: bold;',
    heading4: 'font-size: 1em; margin: 1.33em 0; font-weight: bold;',
    heading5: 'font-size: 0.83em; margin: 1.67em 0; font-weight: bold;',
    heading6: 'font-size: 0.67em; margin: 2.33em 0; font-weight: bold;',
    table: 'border-collapse: collapse; width: 100%; margin: 1em 0;',
    tableCell: 'border: 1px solid #ccc; padding: 8px;',
    image: 'max-width: 100%; height: auto; margin: 1em 0;',
    link: 'color: #0066cc; text-decoration: underline;',
    list: 'margin: 1em 0; padding-left: 40px;',
    blockquote: 'margin: 1em 0; padding-left: 1em; border-left: 4px solid #ccc; color: #666;'
  };



  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.editor = new Editor({
      element: this.editorElement.nativeElement,
      extensions: [
        StarterKit,
        Document,
        Table.configure({
          resizable: true,
        }),
        TableRow,
        TableHeader,
        TableCell,
        Image.configure({
          allowBase64: true,
          inline: true,
          HTMLAttributes: {
            style: 'display: inline-block;',
          },
        }),
        Link.configure({
          openOnClick: false,
        }),
        TextStyle,
        Color,
        FontFamily.configure({
          types: ['textStyle'],
        }),
        FontSize.configure({
          types: ['textStyle'],
        }),
        Underline,
        TextAlign.configure({
          types: ['heading', 'paragraph', 'image', 'table', 'blockquote', 'list'],
        }),
      ],
      content: this.content,
      onUpdate: ({ editor }) => {
        if (!this.skipNextUpdate) {
          const regex = /{{&gt;/g;
          const replacement = '{{>';
          const html = editor.getHTML();
          const inlinedHtml = this.inlineStyles(html);
          this.contentChange.emit(inlinedHtml.replace(regex, replacement));
        }
        this.skipNextUpdate = false;
      },
      editorProps: {
        handlePaste: (view, event) => {
          // Handle image paste
          const items = event.clipboardData?.items;
          if (!items) return false;

          for (const item of Array.from(items)) {
            if (item.type.indexOf('image') === 0) {
              event.preventDefault();
              
              const blob = item.getAsFile();
              if (blob) {
                this.handleImageUpload(blob);
              }
              return true;
            }
          }
          return false;
        },
        handleDrop: (view, event) => {
          // Handle image drop
          const files = event.dataTransfer?.files;
          if (!files) return false;

          for (const file of Array.from(files)) {
            if (file.type.indexOf('image') === 0) {
              event.preventDefault();
              this.handleImageUpload(file);
              return true;
            }
          }
          return false;
        },
      },
    });
    // this.editorElement.nativeElement.addEventListener('paste', this.handlePaste.bind(this));
    this.cdr.detectChanges();
  }

  private handleImageUpload(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      if (this.editor) {
        this.editor.chain()
          .focus()
          .setImage({ src: base64String })
          .run();
      }
    };
    reader.readAsDataURL(file);
  }

  private handlePaste(event: ClipboardEvent) {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (const item of Array.from(items)) {
      if (item.type.indexOf('image') === 0) {
        const blob = item.getAsFile();
        if (blob) {
          event.preventDefault();
          this.handleImageUpload(blob);
        }
      }
    }
  }

  private inlineStyles(html: string): string {
    // Create a temporary DOM element
    const template = document.createElement('template');
    template.innerHTML = html;
    const content = template.content;

    // Apply default styles to elements
    content.querySelectorAll('p').forEach(p => {
      this.appendStyles(p, this.defaultStyles.paragraph);
    });

    content.querySelectorAll('h1').forEach(h1 => {
      this.appendStyles(h1, this.defaultStyles.heading1);
    });

    content.querySelectorAll('h2').forEach(h2 => {
      this.appendStyles(h2, this.defaultStyles.heading2);
    });

    content.querySelectorAll('h3').forEach(h3 => {
      this.appendStyles(h3, this.defaultStyles.heading3);
    });

    content.querySelectorAll('h4').forEach(h4 => {
      this.appendStyles(h4, this.defaultStyles.heading4);
    });

    content.querySelectorAll('h5').forEach(h5 => {
      this.appendStyles(h5, this.defaultStyles.heading5);
    });

    content.querySelectorAll('h6').forEach(h6 => {
      this.appendStyles(h6, this.defaultStyles.heading6);
    });

    content.querySelectorAll('table').forEach(table => {
      this.appendStyles(table, this.defaultStyles.table);
    });

    content.querySelectorAll('td, th').forEach(cell => {
      this.appendStyles(cell, this.defaultStyles.tableCell);
    });

    content.querySelectorAll('img').forEach(img => {
      this.appendStyles(img, this.defaultStyles.image);
    });

    content.querySelectorAll('a').forEach(link => {
      this.appendStyles(link, this.defaultStyles.link);
    });

    content.querySelectorAll('ul, ol').forEach(list => {
      this.appendStyles(list, this.defaultStyles.list);
    });

    content.querySelectorAll('blockquote').forEach(quote => {
      this.appendStyles(quote, this.defaultStyles.blockquote);
    });

    // Handle text alignment
    content.querySelectorAll('[style*="text-align"]').forEach(element => {
      const align = element.getAttribute('data-text-align');
      if (align) {
        this.appendStyles(element, `text-align: ${align};`);
      }
    });

    // Handle font family
    content.querySelectorAll('[style*="font-family"]').forEach(element => {
      const family = element.getAttribute('data-font-family');
      if (family) {
        this.appendStyles(element, `font-family: ${family};`);
      }
    });

    // Handle font size
    content.querySelectorAll('[style*="font-size"]').forEach(element => {
      const size = element.getAttribute('data-font-size');
      if (size) {
        this.appendStyles(element, `font-size: ${size};`);
      }
    });

    // Handle text color
    content.querySelectorAll('[style*="color"]').forEach(element => {
      const color = element.getAttribute('data-color');
      if (color) {
        this.appendStyles(element, `color: ${color};`);
      }
    });

    return template.innerHTML;
  }

  private appendStyles(element: Element, styles: string) {
    const currentStyle = element.getAttribute('style') || '';
    const newStyle = currentStyle ? `${currentStyle}; ${styles}` : styles;
    element.setAttribute('style', newStyle);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['content'] && !changes['content'].firstChange && this.editor) {
      const newContent = changes['content'].currentValue;
      const regex = /{{&gt;/g;
      const replacement = '{{>';
      const currentContent = this.inlineStyles(this.editor.getHTML()).replace(regex, replacement);
      
      if (newContent !== currentContent) {
        this.skipNextUpdate = true;
        this.editor.commands.setContent(newContent, false);
      }
    }
  }

  ngOnDestroy() {
    if (this.editorElement?.nativeElement) {
      this.editorElement.nativeElement.removeEventListener('paste', this.handlePaste);
    }
    this.editor?.destroy();
  }
}