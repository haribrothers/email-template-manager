import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TemplateVariable } from '../models/template.model';

@Injectable({
  providedIn: 'root'
})
export class VariableService {
  private variables = new BehaviorSubject<TemplateVariable[]>([]);
  variables$ = this.variables.asObservable();

  loadVariables() {
    // In a real app, this would load from an API
    const savedVariables = localStorage.getItem('templateVariables');
    if (savedVariables) {
      this.variables.next(JSON.parse(savedVariables));
    }
  }

  private saveToStorage(variables: TemplateVariable[]) {
    localStorage.setItem('templateVariables', JSON.stringify(variables));
  }

  getAllVariables(): TemplateVariable[] {
    return this.variables.getValue();
  }

  getVariableById(id: string): TemplateVariable | undefined {
    return this.variables.getValue().find(v => v.id === id);
  }

  addVariable(variable: TemplateVariable) {
    const current = this.variables.getValue();
    const updated = [...current, variable];
    this.variables.next(updated);
    this.saveToStorage(updated);
  }

  updateVariable(variable: TemplateVariable) {
    const current = this.variables.getValue();
    const updated = current.map(v => v.id === variable.id ? variable : v);
    this.variables.next(updated);
    this.saveToStorage(updated);
  }

  deleteVariable(id: string) {
    const current = this.variables.getValue();
    const updated = current.filter(v => v.id !== id);
    this.variables.next(updated);
    this.saveToStorage(updated);
  }

  validateValue(value: any, type: string): { valid: boolean; error?: string } {
    try {
      switch (type) {
        case 'string':
          return { valid: typeof value === 'string' };
        case 'array':
          return Array.isArray(JSON.parse(value))
            ? { valid: true }
            : { valid: false, error: 'Value must be a valid JSON array' };
        case 'json':
          JSON.parse(value);
          return { valid: true };
        default:
          return { valid: true };
      }
    } catch (error) {
      return { valid: false, error: 'Invalid format' };
    }
  }
}