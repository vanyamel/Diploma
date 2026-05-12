import AuthService from '../services/authService.js';
import UserRepository from '../repositories/userRepository.js';
import AttemptRepository from '../repositories/attemptRepository.js';

const authService = new AuthService();
const userRepository = new UserRepository();
const attemptRepository = new AttemptRepository();

export const register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) return res.status(400).json({ error: 'Заповніть усі поля' });

    const data = await authService.register(email, username, password);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Заповніть усі поля' });

    const data = await authService.login(email, password);
    const progress = await attemptRepository.getUserProgress(data.user.id);
    res.json({ ...data, progress });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await userRepository.findById(req.user.userId);
    const progress = await attemptRepository.getUserProgress(user.id);
    res.json({ user, progress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: 'Токен відсутній' });

    await authService.verifyEmail(token);
    res.json({ message: 'Email успішно підтверджено' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Введіть email' });

    await authService.requestPasswordReset(email);
    res.json({ message: 'Якщо email існує, ми надіслали інструкції для Password reset' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ error: 'Заповніть усі поля' });

    await authService.resetPassword(token, password);
    res.json({ message: 'Пароль успішно змінено' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
