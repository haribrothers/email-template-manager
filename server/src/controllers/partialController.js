import { randomUUID } from 'crypto';
import createError from 'http-errors';
import asyncHandler from 'express-async-handler';
import { db } from '../config/db.js';
import { partialSchema } from '../validation/schemas.js';

export const createPartial = asyncHandler(async (req, res) => {
  const { error } = partialSchema.validate(req.body);
  if (error) {
    throw createError(400, error.details[0].message);
  }

  const partial = {
    id: randomUUID(),
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  db.data.partials.push(partial);
  await db.write();

  res.status(201).json(partial);
});

export const getPartials = asyncHandler(async (req, res) => {
  res.json(db.data.partials);
});

export const getPartialById = asyncHandler(async (req, res) => {
  const partial = db.data.partials.find(p => p.id === req.params.id);
  if (!partial) {
    throw createError(404, 'Partial not found');
  }
  res.json(partial);
});

export const updatePartial = asyncHandler(async (req, res) => {
  const { error } = partialSchema.validate(req.body);
  if (error) {
    throw createError(400, error.details[0].message);
  }

  const index = db.data.partials.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    throw createError(404, 'Partial not found');
  }

  const updatedPartial = {
    ...db.data.partials[index],
    ...req.body,
    updatedAt: new Date()
  };

  db.data.partials[index] = updatedPartial;
  await db.write();

  res.json(updatedPartial);
});

export const deletePartial = asyncHandler(async (req, res) => {
  const index = db.data.partials.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    throw createError(404, 'Partial not found');
  }

  db.data.partials.splice(index, 1);
  await db.write();

  res.status(204).send();
});