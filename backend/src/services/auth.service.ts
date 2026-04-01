import { AuthRepository } from '../repositories/auth.repository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your-access-secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret';

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async register(data: any) {
    const existingUser = await this.authRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('User already exists with this email.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.authRepository.create({
      ...data,
      password: hashedPassword,
    });

    const accessToken = this.generateAccessToken(user.id, user.email);
    const refreshToken = this.generateRefreshToken(user.id);

    await this.authRepository.updateRefreshToken(user.id, refreshToken);

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, accessToken, refreshToken };
  }

  async login(email: string, pass: string) {
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const accessToken = this.generateAccessToken(user.id, user.email);
    const refreshToken = this.generateRefreshToken(user.id);

    await this.authRepository.updateRefreshToken(user.id, refreshToken);

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, accessToken, refreshToken };
  }

  async refresh(token: string) {
    try {
      const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as { id: string };
      const user = await this.authRepository.findById(decoded.id);

      if (!user || user.refreshToken !== token) {
        throw new Error('Invalid refresh token.');
      }

      const accessToken = this.generateAccessToken(user.id, user.email);
      const newRefreshToken = this.generateRefreshToken(user.id);

      await this.authRepository.updateRefreshToken(user.id, newRefreshToken);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new Error('Refresh token expired or invalid.');
    }
  }

  async logout(userId: string) {
    await this.authRepository.updateRefreshToken(userId, null);
  }

  async getUserProfile(userId: string) {
    const user = await this.authRepository.findById(userId);
    if (!user) {
      throw new Error('User not found.');
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private generateAccessToken(id: string, email: string) {
    return jwt.sign({ id, email }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  }

  private generateRefreshToken(id: string) {
    return jwt.sign({ id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  }
}
