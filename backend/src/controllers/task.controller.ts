import { Response, NextFunction } from 'express';
import { TaskService } from '../services/task.service';
import { AuthRequest } from '../middleware/auth.middleware';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  getTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { status, search, page = '1', limit = '10' } = req.query as any;

      const pageNum = Math.max(1, parseInt(page as string) || 1);
      const limitNum = Math.max(1, Math.min(100, parseInt(limit as string) || 10));

      const skip = (pageNum - 1) * limitNum;
      const take = limitNum;

      const result = await this.taskService.getTasks(userId, { status: status as string, search: search as string, skip, take });

      res.status(200).json({
        success: true,
        data: result.tasks,
        total: result.total,
        page: pageNum,
        limit: limitNum,
      });
    } catch (error: any) {
      next(error);
    }
  };

  getTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const task = await this.taskService.getTaskById(id as string, userId);
      res.status(200).json({ success: true, data: task });
    } catch (error: any) {
      next(error);
    }
  };

  createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { title, description, priority } = req.body;
      const task = await this.taskService.createTask({ title, description, userId, priority } as any);
      res.status(201).json({ success: true, data: task });
    } catch (error: any) {
      next(error);
    }
  };

  updateTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const { title, description, status, priority } = req.body;
      const task = await this.taskService.updateTask(id as string, userId, { title, description, status, priority } as any);
      res.status(200).json({ success: true, data: task });
    } catch (error: any) {
      next(error);
    }
  };

  deleteTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      await this.taskService.deleteTask(id as string, userId);
      res.status(200).json({ success: true, message: 'Task deleted successfully.' });
    } catch (error: any) {
      next(error);
    }
  };

  toggleTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const task = await this.taskService.toggleTask(id as string, userId);
      res.status(200).json({ success: true, data: task });
    } catch (error: any) {
      next(error);
    }
  };
}
