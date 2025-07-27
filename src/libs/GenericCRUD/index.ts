import { Request, Response } from 'express';
import { ZodObject, ZodRawShape } from 'zod';
import { prismaClient } from '../database/prismaClient';

type ModelName = keyof typeof prismaClient;

export const findAllGeneric = ({ modelName }: { modelName: ModelName }) => {
  const model = prismaClient[modelName] as any;

  return async (_req: Request, res: Response) => {
    try {
      const records = await model.findMany();

      console.log(records);

      // Remover campo "password", se existir
      const safeRecords = records.map(({ password, ...rest }: any) => rest);

      return res.json(safeRecords);
    } catch (error) {
      console.error(
        `
Error fetching model records ${String(modelName)}:`,
        error,
      );
      return res.status(500).json({ error: 'Error fetching model records' });
    }
  };
};

export const createGeneric = <TSchema extends ZodObject<ZodRawShape>>({
  modelName,
  schema,
}: {
  modelName: ModelName;
  schema: TSchema;
}) => {
  const model = prismaClient[modelName] as any;

  return async (data: unknown) => {
    const parsed = schema.safeParse(data);
    if (!parsed.success) throw parsed.error;
    return await model.create({ data: parsed.data });
  };
};

export const updateGeneric = <TSchema extends ZodObject<ZodRawShape>>({
  modelName,
  schema,
}: {
  modelName: ModelName;
  schema: TSchema;
}) => {
  const model = prismaClient[modelName] as any;
  const updateSchema = schema.partial();

  return async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const parsed = updateSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues });
      }

      const updated = await model.update({
        where: { id },
        data: parsed.data,
      });

      // Remover campo "password", se existir
      const { password, ...safeData } = updated as any;

      return res.json(safeData);
    } catch (error: any) {
      console.error(`Error updating model record ${String(modelName)}:`, error);
      return res.status(500).json({ error: 'Error updating model record!' });
    }
  };
};

export const deleteGeneric = ({ modelName }: { modelName: ModelName }) => {
  const model = prismaClient[modelName] as any;

  return async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = await model.delete({ where: { id } });
      return res.status(204).json();
    } catch (error: any) {
      console.error(
        `
Error deleting model record${String(modelName)}:`,
        error,
      );
      return res.status(500).json({ error: 'Error deleting model record' });
    }
  };
};
