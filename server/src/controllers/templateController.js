import { randomUUID } from 'crypto';
import createError from 'http-errors';
import asyncHandler from 'express-async-handler';
import { db } from '../config/db.js';
import { templateSchema } from '../validation/schemas.js';

export const createTemplate = asyncHandler(async (req, res) => {
  const { error } = templateSchema.validate(req.body);
  if (error) {
    throw createError(400, error.details[0].message);
  }

  const template = {
    id: randomUUID(),
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  db.data.templates.push(template);
  await db.write();

  res.status(201).json(template);
});

export const getTemplates = asyncHandler(async (req, res) => {
  res.json(db.data.templates);
});

export const getTemplateById = asyncHandler(async (req, res) => {
  const template = db.data.templates.find(t => t.id === req.params.id);
  if (!template) {
    throw createError(404, 'Template not found');
  }
  res.json(template);
});

export const updateTemplate = asyncHandler(async (req, res) => {
  const { error } = templateSchema.validate(req.body);
  if (error) {
    throw createError(400, error.details[0].message);
  }

  const index = db.data.templates.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    throw createError(404, 'Template not found');
  }

  const updatedTemplate = {
    ...db.data.templates[index],
    ...req.body,
    updatedAt: new Date()
  };

  db.data.templates[index] = updatedTemplate;
  await db.write();

  res.json(updatedTemplate);
});

export const deleteTemplate = asyncHandler(async (req, res) => {
  const index = db.data.templates.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    throw createError(404, 'Template not found');
  }

  db.data.templates.splice(index, 1);
  await db.write();

  res.status(204).send();
});