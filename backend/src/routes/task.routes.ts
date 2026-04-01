import { Router } from 'express';
import { body } from 'express-validator';
import { TaskController } from '../controllers/task.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();
const taskController = new TaskController();

router.use(authenticate);

router.get('/', taskController.getTasks);

router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required.'),
    body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Invalid priority.'),
    validate,
  ],
  taskController.createTask
);

router.get('/:id', taskController.getTask);

router.patch(
  '/:id',
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty.'),
    body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Invalid priority.'),
    body('status').optional().isIn(['PENDING', 'COMPLETED']).withMessage('Invalid status.'),
    validate,
  ],
  taskController.updateTask
);

router.delete('/:id', taskController.deleteTask);
router.patch('/:id/toggle', taskController.toggleTask);

export default router;
