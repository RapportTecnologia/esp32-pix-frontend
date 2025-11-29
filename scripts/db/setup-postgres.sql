-- ============================================================================
-- Script de Configuração do Banco de Dados PostgreSQL
-- Projeto: Rapport-PIX (ESP32 PIX Frontend)
-- ============================================================================
-- Propósito: Criar usuário e banco de dados dedicados para o projeto
-- Autor: Sistema de Automação
-- Data: 2024-11-29
-- Dependências: PostgreSQL 12+
-- ============================================================================
-- IMPORTANTE: Execute este script como usuário root/postgres
-- Comando: psql -U postgres -f scripts/db/setup-postgres.sql
-- ============================================================================

-- Criar usuário dedicado para o projeto
-- Senha: rapport_pix_2024_secure (ALTERE EM PRODUÇÃO!)
CREATE USER rapport_pix WITH PASSWORD 'rapport_pix_2024_secure';

-- Criar banco de dados dedicado
CREATE DATABASE rapport_pix
    WITH 
    OWNER = rapport_pix
    ENCODING = 'UTF8'
    LC_COLLATE = 'C.UTF-8'
    LC_CTYPE = 'C.UTF-8'
    TEMPLATE = template0
    CONNECTION LIMIT = -1;

-- Comentário descritivo do banco
COMMENT ON DATABASE rapport_pix IS 'Banco de dados do projeto Rapport-PIX - Sistema de pagamentos PIX com ESP32';

-- Conceder privilégios ao usuário
GRANT ALL PRIVILEGES ON DATABASE rapport_pix TO rapport_pix;

-- Conectar ao banco criado para configurações adicionais
\c rapport_pix

-- Conceder privilégios no schema public
GRANT ALL ON SCHEMA public TO rapport_pix;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO rapport_pix;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO rapport_pix;

-- Configurar privilégios padrão para objetos futuros
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO rapport_pix;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO rapport_pix;

-- Criar extensões úteis (opcional)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  -- Para geração de UUIDs
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- Para funções de criptografia

-- ============================================================================
-- Verificação
-- ============================================================================
-- Para verificar se tudo foi criado corretamente, execute:
-- \du rapport_pix
-- \l rapport_pix
-- \c rapport_pix
-- \dn+
-- ============================================================================
