import { randomUUID } from 'crypto';
import createError from 'http-errors';
import asyncHandler from 'express-async-handler';
import { db } from '../config/db.js';
import { variableSchema } from '../validation/schemas.js';

export const createVariable = asyncHandler(async (req, res) => {
  const { error } = variableSchema.validate(req.body);
  if (error) {
    throw createError(400, error.details[0].message);
  }

  const variable = {
    id: randomUUID(),
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  db.data.variables.push(variable);
  await db.write();

  res.status(201).json(variable);
});

export const getVariables = asyncHandler(async (req, res) => {
  res.json(db.data.variables);
});

export const getVariableById = asyncHandler(async (req, res) => {
  const variable = db.data.variables.find(v => v.id === req.params.id);
  if (!variable) {
    throw createError(404, 'Variable not found');
  }
  res.json(variable);
});

export const updateVariable = asyncHandler(async (req, res) => {
  const { error } = variableSchema.validate(req.body);
  if (error) {
    throw createError(400, error.details[0].message);
  }

  const index = db.data.variables.findIndex(v => v.id === req.params.id);
  if (index === -1) {
    throw createError(404, 'Variable not found');
  }

  const updatedVariable = {
    ...db.data.variables[index],
    ...req.body,
    updatedAt: new Date()
  };

  db.data.variables[index] = updatedVariable;
  await db.write();

  res.json(updatedVariable);
});

export const deleteVariable = asyncHandler(async (req, res) => {
  const index = db.data.variables.findIndex(v => v.id === req.params.id);
  if (index === -1) {
    throw createError(404, 'Variable not found');
  }

  // Check if variable is used in any template
  const isUsedInTemplate = db.data.templates.some(template => 
    template.variables.some(v => v.id === req.params.id)
  );

  if (isUsedInTemplate) {
    throw createError(400, 'Cannot delete variable as it is used in one or more templates');
  }

  db.data.variables.splice(index, 1);
  await db.write();

  res.status(204).send();
});