import { prismaClient } from '@/libs/database/prismaClient';
import { generateToken } from '@/libs/jwt';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string(),
  password: z.string().min(8),
});

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string(),
  password: z.string().min(6),
  age: z.number().positive().optional(),
  phone: z.string().min(8).max(20).optional(),
});

export const login = async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.issues });
  }

  const { email, password } = result.data;

  const user = await prismaClient.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(404).json({ error: 'User not found!' });
  }

  // Verifica se a senha bate com os dados do DB
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateToken({ id: user.id, email: user.email });

  return res.json({ token });
};

export const registerUser = async (req: Request, res: Response) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.issues });
  }

  const { name, email, password, age, phone } = result.data;

  const existingUser = await prismaClient.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ error: 'Incorrect data in the request!' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prismaClient.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      age,
      phone,
    },
  });

  const { password: _, ...userWithoutPassword } = newUser;

  return res.status(201).json(userWithoutPassword);
};
