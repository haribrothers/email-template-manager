import { Component, ElementRef, ViewChild, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as monaco from 'monaco-editor';
import loader from '@monaco-editor/loader';

@Component({
  selector: 'app-monaco-json-editor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #editorContainer class="h-[200px] border rounded-md"></div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class MonacoJsonEditorComponent implements OnInit, OnDestroy {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();

  private editor: monaco.editor.IStandaloneCodeEditor | null = null;
  private subscription: any;

  ngOnInit() {
    this.initMonaco();
  }

  private async initMonaco() {
    try {
      const monaco = await loader.init();

      this.editor = monaco.editor.create(this.editorContainer.nativeElement, {
        value: this.formatJson(this.value),
        language: 'json',
        theme: 'vs-light',
        automaticLayout: true,
        minimap: { enabled: false },
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        roundedSelection: false,
        padding: { top: 8 },
        fontSize: 14,
        tabSize: 2
      });

      this.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        this.formatDocument();
      });

      this.subscription = this.editor.onDidChangeModelContent(() => {
        this.onEditorChange();
      });

    } catch (error) {
      console.error('Failed to load Monaco Editor:', error);
    }
  }

  private formatJson(value: string): string {
    try {
      const parsed = JSON.parse(value || '{}');
      return JSON.stringify(parsed, null, 2);
    } catch {
      return value || '{}';
    }
  }

  private formatDocument() {
    if (!this.editor) return;

    try {
      const value = this.editor.getValue();
      const formatted = this.formatJson(value);
      this.editor.setValue(formatted);
    } catch (error) {
      console.error('Format error:', error);
    }
  }

  private onEditorChange() {
    if (!this.editor) return;

    try {
      const value = this.editor.getValue();
      JSON.parse(value);
      this.valueChange.emit(value);
    } catch {
      // Invalid JSON
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.dispose();
    }
    if (this.editor) {
      this.editor.dispose();
    }
  }
}