import { createReducer, on } from '@ngrx/store';
import { Template } from '../models/template.model';
import { TemplateActions } from './template.actions';
import { TemplateState } from './template.state';

const initialState: TemplateState = {
  templates: [],
  selectedTemplateId: null,
  loading: false,
  error: null
};

export const templateReducer = createReducer(
  initialState,
  on(TemplateActions.loadTemplates, (state: TemplateState, { templates }: { templates: Template[] }) => ({
    ...state,
    templates
  })),
  on(TemplateActions.addTemplate, (state: TemplateState, { template }: { template: Template }) => ({
    ...state,
    templates: [...state.templates, template]
  })),
  on(TemplateActions.updateTemplate, (state: TemplateState, { template }: { template: Template }) => ({
    ...state,
    templates: state.templates.map((t: Template) => 
      t.id === template.id ? template : t
    )
  })),
  on(TemplateActions.deleteTemplate, (state: TemplateState, { id }: { id: string }) => ({
    ...state,
    templates: state.templates.filter((t: Template) => t.id !== id)
  })),
  on(TemplateActions.selectTemplate, (state: TemplateState, { id }: { id: string }) => ({
    ...state,
    selectedTemplateId: id
  }))
);