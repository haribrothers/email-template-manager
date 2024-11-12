import { createActionGroup, props } from '@ngrx/store';
import { Template } from '../models/template.model';

export const TemplateActions = createActionGroup({
  source: 'Template',
  events: {
    'Load Templates': props<{ templates: Template[] }>(),
    'Add Template': props<{ template: Template }>(),
    'Update Template': props<{ template: Template }>(),
    'Delete Template': props<{ id: string }>(),
    'Select Template': props<{ id: string }>()
  }
});