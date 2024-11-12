import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HtmlFormatterService {
  format(html: string): string {
    let formatted = '';
    let indent = 0;
    const tab = '  '; // 2 spaces for indentation
    
    // Convert string to array of characters
    const chars = html.trim().split('');
    let inTag = false;
    let inContent = false;
    let currentChar = '';
    let previousChar = '';
    let tagContent = '';
    
    for (let i = 0; i < chars.length; i++) {
      previousChar = currentChar;
      currentChar = chars[i];
      
      // Handle tags
      if (currentChar === '<' && chars[i + 1] !== '/') {
        inTag = true;
        tagContent = '';
        if (inContent) {
          formatted += '\n' + tab.repeat(indent);
        }
        tagContent += currentChar;
      } else if (currentChar === '<' && chars[i + 1] === '/') {
        inTag = true;
        tagContent = '';
        if (inContent) {
          formatted += '\n' + tab.repeat(--indent);
        } else {
          indent--;
        }
        tagContent += currentChar;
      } else if (currentChar === '>') {
        inTag = false;
        tagContent += currentChar;
        formatted += tagContent;
        
        // Handle self-closing tags
        if (tagContent.includes('/>') || tagContent.includes('</')) {
          formatted += '\n' + tab.repeat(indent);
        } else {
          formatted += '\n' + tab.repeat(++indent);
        }
        inContent = true;
        tagContent = '';
      } else if (inTag) {
        tagContent += currentChar;
      } else if (currentChar.match(/\S/)) {
        if (inContent && previousChar === '>') {
          formatted = formatted.trimEnd();
        }
        formatted += currentChar;
        inContent = true;
      }
    }
    
    // Handle Handlebars expressions
    formatted = this.formatHandlebars(formatted);
    
    return formatted.trim();
  }
  
  private formatHandlebars(html: string): string {
    // Format Handlebars expressions while preserving HTML formatting
    const lines = html.split('\n');
    let formatted = '';
    let inHandlebars = false;
    let handlebarsContent = '';
    
    for (const line of lines) {
      let formattedLine = line;
      
      // Handle multi-line Handlebars expressions
      if (line.includes('{{') && !line.includes('}}')) {
        inHandlebars = true;
        handlebarsContent = line + '\n';
        continue;
      }
      
      if (inHandlebars) {
        if (line.includes('}}')) {
          inHandlebars = false;
          handlebarsContent += line;
          formattedLine = this.formatHandlebarsExpression(handlebarsContent);
        } else {
          handlebarsContent += line + '\n';
          continue;
        }
      }
      
      // Format single-line Handlebars expressions
      if (line.includes('{{') && line.includes('}}')) {
        const expressions = line.match(/{{[^}]+}}/g) || [];
        for (const expr of expressions) {
          formattedLine = formattedLine.replace(
            expr,
            this.formatHandlebarsExpression(expr)
          );
        }
      }
      
      formatted += formattedLine + '\n';
    }
    
    return formatted;
  }
  
  private formatHandlebarsExpression(expr: string): string {
    // Format individual Handlebars expressions
    return expr
      .replace(/{{/g, '{{ ')
      .replace(/}}/g, ' }}')
      .replace(/\s+/g, ' ')
      .trim();
  }
}