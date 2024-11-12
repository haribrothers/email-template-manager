import express from 'express';
import {
  createPartial,
  getPartials,
  getPartialById,
  updatePartial,
  deletePartial
} from '../controllers/partialController.js';

const router = express.Router();

router.post('/', createPartial);
router.get('/', getPartials);
router.get('/:id', getPartialById);
router.put('/:id', updatePartial);
router.delete('/:id', deletePartial);

export default router;