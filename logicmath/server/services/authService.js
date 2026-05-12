import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import UserRepository from '../repositories/userRepository.js';
import { sendVerificationEmail, sendPasswordResetEmail } from './emailService.js';

const userRepository = new UserRepository();

export default class AuthService {
  async register(email, username, password) {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw new Error('Користувач з таким email вже існує');

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);
    
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const user = await userRepository.createUser({ email, username, passwordHash, verificationToken });
    
    await sendVerificationEmail(email, verificationToken);
    
    return { user: { id: user.id, email: user.email }, requiresVerification: true };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error('Невірний email або пароль');

    if (!user.is_verified) throw new Error('Будь ласка, підтвердіть ваш email перед входом');

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) throw new Error('Невірний email або пароль');

    const token = this._generateToken(user);
    const { password_hash, verification_token, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async verifyEmail(token) {
    const user = await userRepository.findByVerificationToken(token);
    if (!user) throw new Error('Невірний або прострочений токен верифікації');

    await userRepository.markAsVerified(user.id);
    return true;
  }

  async requestPasswordReset(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) return true; // Silent success for security

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    await userRepository.setResetToken(email, resetToken, expiresAt);
    await sendPasswordResetEmail(email, resetToken);
    return true;
  }

  async resetPassword(token, newPassword) {
    const user = await userRepository.findByResetToken(token);
    if (!user || new Date(user.reset_token_expires) < new Date()) {
      throw new Error('Невірний або прострочений токен Password reset');
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await userRepository.updatePassword(user.id, passwordHash);
    return true;
  }

  _generateToken(user) {
    return jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );
  }
}
