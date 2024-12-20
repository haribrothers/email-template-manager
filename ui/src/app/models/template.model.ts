export interface Template {
  id: string;
  name: string;
  content: string;
  variables: TemplateVariable[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateVariable {
  id: string;
  name: string;
  path: string;
  type: 'string' | 'number' | 'array' | 'json';
  defaultValue: any;
  description?: string;
  required: boolean;
}

export interface TemplatePartial {
  id: string;
  name: string;
  content: string;
  description?: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}
