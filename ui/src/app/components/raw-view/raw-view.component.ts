import { Component, OnInit, ElementRef, ViewChild, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import * as monaco from 'monaco-editor';
import loader from '@monaco-editor/loader';
import { CommonModule } from '@angular/common';
import { Template } from 'src/app/models/template.model';

@Component({
  selector: 'app-raw-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './raw-view.component.html',
  styleUrl: './raw-view.component.css'
})
export class RawViewComponent implements OnChanges, OnInit, OnDestroy {
  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;

  @Input() htmlContent = '';

  private editor: any;
  // private htmlContent = `<p><strong><em>ssdsd</em></strong> <span style="color: rgb(240, 199, 199)">skdfhgskdsd</span> <span style="font-family: Arial; font-size: 20px"><strong><em>{{sample}}</em></strong></span> sihdgsdsdsd</p><p><span style="font-family: Helvetica; font-size: 28px"><strong>{{sample}}</strong></span></p><ul><li><p><span style="font-family: Verdana; font-size: 24px">sd</span></p><ul><li><p></p></li></ul></li><li><p>sd</p></li><li><p>sd</p></li></ul><p>sd</p><ul><li><p>Hello</p></li></ul><ol><li><p>Sample</p></li><li><p></p></li></ol><p>sd</p><p>sd</p><p>sdsd</p><p>sd</p><p>sd</p><p>sd</p><p>sd</p><p>sd</p><p>sd</p><p>sd</p><p>sd</p><p>sd</p><p>ds</p><p>sd</p><p>sd</p><p>sd</p><p>sd</p>`;

  constructor() {
    // loader.config({ paths: { vs: 'assets/monaco-editor/min/vs' } });
  }

  ngOnInit() {
    this.initMonaco();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['htmlContent']) {
      console.log('changes', changes)
      if (!changes['htmlContent']?.firstChange) {
        const formattedHTML = this.formatHTML(this.htmlContent);
        this.editor.setValue(formattedHTML);
      }
    }
  }

  private formatHTML(html: string): string {
    let formatted = '';
    let indent = '';
    const tab = '    ';
    const nodes = this.parseHTML(html);

    function formatNode(node: Node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim();
        if (text) {
          formatted += indent + text + '\n';
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        const tagName = element.tagName.toLowerCase();

        let startTag = `${indent}<${tagName}`;

        Array.from(element.attributes).forEach(attr => {
          startTag += ` ${attr.name}="${attr.value}"`;
        });

        startTag += '>';
        formatted += startTag + '\n';

        indent += tab;

        Array.from(element.childNodes).forEach(child => {
          formatNode(child);
        });

        indent = indent.slice(0, -tab.length);

        formatted += `${indent}</${tagName}>\n`;
      }
    }

    nodes.forEach(node => formatNode(node));
    return formatted;
  }

  private parseHTML(html: string): Node[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return Array.from(doc.body.childNodes);
  }

  private async initMonaco() {
    try {
      const monaco = await loader.init();

      const formattedHTML = this.formatHTML(this.htmlContent);

      this.editor = monaco.editor.create(this.editorContainer.nativeElement, {
        value: formattedHTML,
        language: 'html',
        theme: 'vs-light',
        automaticLayout: true,
        formatOnPaste: true,
        formatOnType: true,
        wordWrap: 'on',
        minimap: {
          enabled: true
        },
        readOnly: true,
        scrollBeyondLastLine: false,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollbar: {
          useShadows: false,
          verticalHasArrows: false,
          horizontalHasArrows: false,
          vertical: 'visible',
          horizontal: 'visible'
        },
        fontSize: 12,
        tabSize: 2
      });

      this.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
        this.formatDocument();
      });

    } catch (error) {
      console.error('Failed to load Monaco Editor:', error);
    }
  }

  formatDocument() {
    if (this.editor) {
      const value = this.editor.getValue();
      const formatted = this.formatHTML(value);
      this.editor.setValue(formatted);
    }
  }

  getValue(): string {
    return this.editor?.getValue() ?? '';
  }

  setValue(value: string) {
    if (this.editor) {
      const formatted = this.formatHTML(value);
      this.editor.setValue(formatted);
    }
  }

  ngOnDestroy() {
    if (this.editor) {
      this.editor.dispose();
    }
  }
}
