#!/usr/bin/env node
/**
 * Script para configurar o banco de dados dinamicamente.
 * - Se DATABASE_URL estiver definida, usa PostgreSQL
 * - Se DATABASE_PROVIDER=sqlite ou DATABASE_URL não definida em dev, usa SQLite
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const isDevelopment = process.env.NODE_ENV !== 'production';
const databaseUrl = process.env.DATABASE_URL;
const databaseProvider = process.env.DATABASE_PROVIDER || '';

// Determina o provider a usar
let provider = 'postgresql';
let url = databaseUrl || '';

if (databaseProvider.toLowerCase() === 'sqlite') {
  provider = 'sqlite';
  url = databaseUrl || 'file:./prisma/dev.db';
} else if (!databaseUrl && isDevelopment) {
  provider = 'sqlite';
  url = 'file:./prisma/dev.db';
  console.log('⚠️  DATABASE_URL não configurada. Usando SQLite como fallback (dev).');
}

if (provider === 'postgresql' && !databaseUrl) {
  console.error('❌ DATABASE_URL é obrigatória para PostgreSQL em produção.');
  process.exit(1);
}

// Template do schema
const schemaTemplate = `// AUTO-GENERATED - Não edite diretamente
// Gerado por scripts/setup-db.js
// Provider: ${provider}

datasource db {
  provider = "${provider}"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String
  role          String    @default("user") // admin, user
  accounts      Account[]
  sessions      Session[]
  apiKeys       ApiKey[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime?
}

model Account {
  id                String @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  user              User   @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Product {
  id          String    @id @default(cuid())
  amount      Int
  quantity    Int?
  payerEmail  String?
  description String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime?
}

${provider === 'postgresql' ? `enum OrderStatus {
  PENDING
  APPROVED
  CANCELLED
}

model Order {
  id           String      @id @default(cuid())
  paymentId    String      @unique
  amount       Int
  description  String
  status       OrderStatus @default(PENDING)
  qrCode       String?
  qrCodeBase64 String?
  paymentUrl   String?
  createdAt    DateTime    @default(now())
  updatedAt    DateTime?
}

model ApiKey {
  id          String    @id @default(cuid())
  name        String
  key         String    @unique
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  lastUsedAt  DateTime?
  expiresAt   DateTime?
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime?
}` : `model Order {
  id           String   @id @default(cuid())
  paymentId    String   @unique
  amount       Int
  description  String
  status       String   @default("PENDING")
  qrCode       String?
  qrCodeBase64 String?
  paymentUrl   String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime?
}

model ApiKey {
  id          String    @id @default(cuid())
  name        String
  key         String    @unique
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  lastUsedAt  DateTime?
  expiresAt   DateTime?
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime?
}`}
`;

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const currentSchema = fs.existsSync(schemaPath) ? fs.readFileSync(schemaPath, 'utf8') : '';

// Verifica se precisa atualizar o schema
const providerMatch = currentSchema.match(/provider\s*=\s*"(\w+)"/);
const currentProvider = providerMatch ? providerMatch[1] : null;

if (currentProvider !== provider) {
  console.log(`🔄 Alterando provider de ${currentProvider || 'nenhum'} para ${provider}...`);
  fs.writeFileSync(schemaPath, schemaTemplate);
  
  // Define DATABASE_URL para o generate
  const envUrl = provider === 'sqlite' ? 'file:./prisma/dev.db' : databaseUrl;
  
  console.log('📦 Gerando Prisma Client...');
  try {
    execSync(`DATABASE_URL="${envUrl}" npx prisma generate`, {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit'
    });
    
    // Cria/atualiza o banco se for SQLite
    if (provider === 'sqlite') {
      console.log('🗄️  Sincronizando banco SQLite...');
      execSync(`DATABASE_URL="${envUrl}" npx prisma db push --skip-generate`, {
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit'
      });
    }
    
    console.log(`✅ Configurado para ${provider.toUpperCase()}`);
  } catch (error) {
    console.error('❌ Erro ao gerar Prisma Client:', error.message);
    process.exit(1);
  }
} else {
  console.log(`✅ Provider já configurado: ${provider.toUpperCase()}`);
}

// Exporta a URL correta para uso
if (provider === 'sqlite' && !process.env.DATABASE_URL) {
  console.log(`📝 Defina DATABASE_URL=file:./prisma/dev.db no seu ambiente`);
}
