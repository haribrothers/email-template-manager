import { Template } from '../models/template.model';

export interface TemplateState {
  templates: Template[];
  selectedTemplateId: string | null;
  loading: boolean;
  error: string | null;
}

export interface AppState {
  template: TemplateState;
}