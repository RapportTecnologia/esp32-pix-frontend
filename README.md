This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Configuração do Banco de Dados

Este projeto usa Prisma com suporte a **PostgreSQL** e **SQLite**. O provider é configurado via variáveis de ambiente.

### Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | URL de conexão do banco de dados |
| `DATABASE_PROVIDER` | Provider a usar: `postgresql` ou `sqlite` (opcional) |

### PostgreSQL (Produção)

```bash
DATABASE_URL="postgresql://user:password@host:5432/database"
npm run dev
```

### SQLite (Desenvolvimento)

Se `DATABASE_URL` não estiver definida em desenvolvimento, o sistema usa SQLite automaticamente:

```bash
npm run dev  # Detecta ausência de DATABASE_URL e usa SQLite
```

Ou force SQLite explicitamente:

```bash
npm run dev:sqlite
```

O banco SQLite será criado em `prisma/dev.db`.

### Como funciona

O script `scripts/setup-db.js` é executado antes do `npm run dev` e:
1. Detecta `DATABASE_PROVIDER` ou infere a partir de `DATABASE_URL`
2. Gera o schema Prisma com o provider correto
3. Regenera o Prisma Client se necessário
4. Sincroniza o banco SQLite automaticamente (se aplicável)

> ⚠️ **Atenção:** Em produção (`NODE_ENV=production`), `DATABASE_URL` é obrigatória.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Configuração do Mercado Pago

Este projeto usa o Mercado Pago para processar pagamentos.

### Crie um produto no Mercado Pago

Use a url: https://developers.mercadolivre.com.br/devcenter

### Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `MP_ACCESS_TOKEN` | Token de acesso da API do Mercado Pago |
| `MP_WEBHOOK_SECRET` | Secret para verificação de assinatura dos webhooks do Mercado Pago |

### Mercado Pago (Produção)

```bash
MP_ACCESS_TOKEN=
MP_WEBHOOK_SECRET=
npm run dev
```
