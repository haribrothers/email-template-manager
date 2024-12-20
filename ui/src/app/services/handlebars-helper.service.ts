import { Injectable } from '@angular/core';
import * as Handlebars from 'handlebars';

export interface BlockHelper {
  id: string;
  name: string;
  template: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class HandlebarsHelperService {
  private blockHelpers: BlockHelper[] = [
    {
      id: 'if',
      name: 'if',
      template: '{{#if condition}}\n  content\n{{/if}}',
      description: 'Conditionally render content'
    },
    {
      id: 'unless',
      name: 'unless',
      template: '{{#unless condition}}\n  content\n{{/unless}}',
      description: 'Render content if condition is false'
    },
    {
      id: 'each',
      name: 'each',
      template: '{{#each items}}\n  {{this}}\n{{/each}}',
      description: 'Iterate over an array'
    },
    {
      id: 'with',
      name: 'with',
      template: '{{#with object}}\n  {{property}}\n{{/with}}',
      description: 'Change context'
    },
    {
      id: 'each-with',
      name: 'each-with',
      template: '{{#each items}}\n  {{#with this}}\n    {{property}}\n  {{/with}}\n{{/each}}',
      description: 'Iterate over array of objects'
    },
    {
      id: 'nested-with',
      name: 'nested-with',
      template: '{{#with object}}\n  {{#with nested}}\n    {{property}}\n  {{/with}}\n{{/with}}',
      description: 'Access nested object properties'
    },
    {
      id: 'log',
      name: 'log',
      template: '{{log value}}',
      description: 'Log a value to the console'
    },
    {
      id: 'today',
      name: 'Today',
      template: '{{today}}',
      description: 'Insert current date'
    },
    {
      id: 'formatDate',
      name: 'Format Date',
      template: '{{formatDate format="MM/DD/YYYY"}}',
      description: 'Insert formatted current date'
    }
  ];

  constructor() {
    this.registerHelpers();
  }

  private registerHelpers() {
    Handlebars.registerHelper('today', function() {
      return new Date().toLocaleDateString();
    });

    Handlebars.registerHelper('formatDate', function(options) {
      const format = options.hash.format || 'MM/DD/YYYY';
      const date = new Date();
      
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      
      return format
        .replace('MM', month)
        .replace('DD', day)
        .replace('YYYY', year.toString())
        .replace('YY', year.toString().slice(-2));
    });

    Handlebars.registerHelper('log', function(value) {
      console.log(value);
      return '';
    });
  }

  getBlockHelpers(): BlockHelper[] {
    return this.blockHelpers;
  }

  generateTemplate(value: any, name: string, level = 0): string {
    const indent = '  '.repeat(level);
    
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return `${indent}{{#each ${name}}}\n${indent}  {{this}}\n${indent}{{/each}}`;
      }
      
      const sample = value[0];
      if (typeof sample === 'object' && sample !== null) {
        const properties = this.generateObjectTemplate(sample, 'this', level + 1);
        return `${indent}{{#each ${name}}}\n${indent}  {{#with this}}\n${properties}${indent}  {{/with}}\n${indent}{{/each}}`;
      }
      
      return `${indent}{{#each ${name}}}\n${indent}  {{this}}\n${indent}{{/each}}`;
    }
    
    if (typeof value === 'object' && value !== null) {
      return this.generateObjectTemplate(value, name, level);
    }
    
    return `${indent}{{${name}}}`;
  }

  private generateObjectTemplate(obj: any, name: string, level = 0): string {
    const indent = '  '.repeat(level);
    let template = '';

    if (Object.keys(obj).length === 0) {
      return `${indent}{{#with ${name}}}\n${indent}  {{property}}\n${indent}{{/with}}\n`;
    }

    template += `${indent}{{#with ${name}}}\n`;
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          template += this.generateTemplate(value, key, level + 1);
        } else {
          template += this.generateObjectTemplate(value, key, level + 1);
        }
      } else {
        template += `${indent}  {{${key}}}\n`;
      }
    }
    
    template += `${indent}{{/with}}\n`;
    return template;
  }
}