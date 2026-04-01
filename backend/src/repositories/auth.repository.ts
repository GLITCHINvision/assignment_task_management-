import prisma from '../utils/prisma';
import { User } from '@prisma/client';

export class AuthRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async create(data: any): Promise<User> {
    return prisma.user.create({ data });
  }

  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }
}
