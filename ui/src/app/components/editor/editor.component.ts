import { Component, ViewChild, ElementRef, AfterViewInit, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { EditorToolbarComponent } from '../editor-toolbar/editor-toolbar.component';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Color from '@tiptap/extension-color';
import { FontSize } from './fontsize.extension';
import TextAlign from '@tiptap/extension-text-align'


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

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.editor = new Editor({
      element: this.editorElement.nativeElement,
      extensions: [
        StarterKit,
        Table.configure({
          resizable: true,
        }),
        TableRow,
        TableHeader,
        TableCell,
        Image,
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
          types: ['heading', 'paragraph'],
        }),
      ],
      content: this.content,
      onUpdate: ({ editor }) => {
        if (!this.skipNextUpdate) {
          const regex = /{{&gt;/g;
          const replacement = '{{>';
          const newContent = editor.getHTML().replace(regex, replacement);
          this.contentChange.emit(newContent);
        }
        this.skipNextUpdate = false;
      },
    });
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['content'] && !changes['content'].firstChange && this.editor) {
      const newContent = changes['content'].currentValue;
      const regex = /{{&gt;/g;
      const replacement = '{{>';
      const currentContent = this.editor.getHTML().replace(regex, replacement);
      
      if (newContent !== currentContent) {
        this.skipNextUpdate = true;
        this.editor.commands.setContent(newContent, false);
      }
    }
  }

  ngOnDestroy() {
    this.editor?.destroy();
  }
}