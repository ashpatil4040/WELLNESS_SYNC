import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export const authenticateUser = async (email, password) => {
  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    return user;
  } catch (error) {
    throw new Error('Authentication failed: ' + error.message);
  }
};

export const createUser = async (userData) => {
  try {
    const { name, email, password } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Create new user
    const user = await User.create({ name, email, password });
    return user;
  } catch (error) {
    throw new Error('User creation failed: ' + error.message);
  }
};

export const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'wellness-sync-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || 'wellness-sync-refresh-secret',
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  );

  return { accessToken, refreshToken };
};

export const verifyToken = (token, isRefreshToken = false) => {
  try {
    const secret = isRefreshToken 
      ? process.env.JWT_REFRESH_SECRET || 'wellness-sync-refresh-secret'
      : process.env.JWT_SECRET || 'wellness-sync-secret';
    
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Token verification failed: ' + error.message);
  }
};

export const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, 12);
  } catch (error) {
    throw new Error('Password hashing failed: ' + error.message);
  }
};

export const comparePasswords = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    throw new Error('Password comparison failed: ' + error.message);
  }
};