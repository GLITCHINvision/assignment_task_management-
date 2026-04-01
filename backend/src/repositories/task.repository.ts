import prisma from '../utils/prisma';
import { Task } from '@prisma/client';

export interface TaskFilters {
  status?: string;
  search?: string;
  skip?: number;
  take?: number;
}

export class TaskRepository {
  async findMany(userId: string, filters: TaskFilters): Promise<{ tasks: Task[]; total: number }> {
    const { status, search, skip = 0, take = 10 } = filters;

    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.task.count({ where }),
    ]);

    return { tasks, total };
  }

  async findById(id: string, userId: string): Promise<Task | null> {
    return prisma.task.findFirst({ where: { id, userId } });
  }

  async create(data: { title: string; description?: string; userId: string; priority?: string }): Promise<Task> {
    return prisma.task.create({ data });
  }

  async update(id: string, userId: string, data: Partial<Task>): Promise<Task> {
    return prisma.task.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userId: string): Promise<Task> {
    return prisma.task.delete({ where: { id } });
  }
}
