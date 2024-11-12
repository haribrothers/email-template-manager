import express from 'express';
import {
  createVariable,
  getVariables,
  getVariableById,
  updateVariable,
  deleteVariable
} from '../controllers/variableController.js';

const router = express.Router();

router.post('/', createVariable);
router.get('/', getVariables);
router.get('/:id', getVariableById);
router.put('/:id', updateVariable);
router.delete('/:id', deleteVariable);

export default router;