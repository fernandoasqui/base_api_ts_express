import { deleteGeneric, findAllGeneric, updateGeneric } from '@/libs/GenericCRUD';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string(),
  age: z.number().positive().optional(),
  phone: z.string().min(8).max(20).optional(),
});

export const findAllUser = findAllGeneric({
  modelName: 'user',
});

export const updateUser = updateGeneric({
  modelName: 'user',
  schema: userSchema,
});
export const deleteUser = deleteGeneric({
  modelName: 'user',
});
