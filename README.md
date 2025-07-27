# Base API TS Express

API genérica construída com TypeScript, Express, Prisma e Zod para validação.

## Sumário

- [Instalação](#instalação)
- [Configuração](#configuração)
- [Estrutura dos Generics](#estrutura-dos-generics)
- [Exemplo de Uso](#exemplo-de-uso)
- [Rotas Padrão](#rotas-padrão)
- [Validação com Zod](#validação-com-zod)
- [Personalização](#personalização)

---

## Instalação

```bash
git clone <repo-url>
cd base_api_ts_express
yarn
```

## Configuração

1. Configure o banco de dados no arquivo `.env` conforme o padrão do Prisma.
2. Gere o client do Prisma:
   ```bash
   yarn prisma generate
   ```
3. Inicie o servidor:
   ```bash
   yarn dev
   ```

## Estrutura dos Generics

O projeto utiliza funções genéricas para CRUD, que recebem o nome do modelo Prisma e, quando necessário, um schema Zod para validação.

- **findAllGeneric**: Busca todos os registros, removendo campos sensíveis como `password`.
- **createGeneric**: Cria um registro validando com Zod.
- **updateGeneric**: Atualiza um registro por ID, validando com Zod.
- **deleteGeneric**: Remove um registro por ID.

Todas retornam handlers compatíveis com Express.

## Exemplo de Uso

### Controller

```typescript
import { findAllGeneric, updateGeneric, deleteGeneric } from '@/libs/GenericCRUD';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string(),
  age: z.number().positive().optional(),
  phone: z.string().min(8).max(20).optional(),
});

export const findAllUser = findAllGeneric({ modelName: 'user' });
export const updateUser = updateGeneric({ modelName: 'user', schema: userSchema });
export const deleteUser = deleteGeneric({ modelName: 'user' });
```

### Rotas

```typescript
import { Router } from 'express';
import { findAllUser, updateUser, deleteUser } from '@/Controllers/UserController';

const router = Router();

router.get('/users', findAllUser);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);

export default router;
```

## Rotas Padrão

- `GET /users` — Lista todos os usuários.
- `PUT /user/:id` — Atualiza um usuário (validação via Zod).
- `DELETE /user/:id` — Remove um usuário.

## Validação com Zod

Para criar ou atualizar, defina um schema Zod no controller. O generic já faz a validação e retorna erro 400 se inválido.

## Personalização

- Para remover outros campos sensíveis, ajuste o array de campos no generic.
- Para adicionar novos models, basta criar o schema Zod e passar o nome do model.

---

> Projeto criado para facilitar a criação de APIs RESTful com validação e segurança centralizadas.
