import { TaskRepository, TaskFilters } from '../repositories/task.repository';
import { Task } from '@prisma/client';

export class TaskService {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  async getTasks(userId: string, filters: TaskFilters) {
    return this.taskRepository.findMany(userId, filters);
  }

  async getTaskById(id: string, userId: string) {
    const task = await this.taskRepository.findById(id, userId);
    if (!task) {
      throw new Error('Task not found.');
    }
    return task;
  }

  async createTask(data: { title: string; description?: string; userId: string; priority?: string }) {
    if (!data.title) {
      throw new Error('Title is required.');
    }
    return this.taskRepository.create(data);
  }

  async updateTask(id: string, userId: string, data: Partial<Task>) {
    const task = await this.getTaskById(id, userId);
    return this.taskRepository.update(id, userId, data);
  }

  async deleteTask(id: string, userId: string) {
    const task = await this.getTaskById(id, userId);
    return this.taskRepository.delete(id, userId);
  }

  async toggleTask(id: string, userId: string) {
    const task = await this.getTaskById(id, userId);
    const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    return this.taskRepository.update(id, userId, { status: newStatus });
  }
}
