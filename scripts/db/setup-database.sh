#!/bin/bash
# ============================================================================
# Script de Configuração Automatizada do Banco de Dados PostgreSQL
# Projeto: Rapport-PIX (ESP32 PIX Frontend)
# ============================================================================
# Propósito: Automatizar a criação do usuário e banco de dados
# Autor: Sistema de Automação
# Data: 2024-11-29
# Dependências: PostgreSQL 12+, psql
# ============================================================================
# Uso: ./scripts/db/setup-database.sh
# ============================================================================

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Emoticons para logs
SUCCESS="✅"
ERROR="❌"
WARNING="⚠️"
INFO="ℹ️"
ROCKET="🚀"
DATABASE="🗄️"

echo -e "${BLUE}${ROCKET} Rapport-PIX - Setup do Banco de Dados PostgreSQL${NC}"
echo "============================================================"
echo ""

# Verificar se PostgreSQL está instalado
if ! command -v psql &> /dev/null; then
    echo -e "${RED}${ERROR} PostgreSQL não está instalado!${NC}"
    echo -e "${YELLOW}${INFO} Instale com: sudo apt install postgresql postgresql-contrib${NC}"
    exit 1
fi

echo -e "${GREEN}${SUCCESS} PostgreSQL encontrado${NC}"

# Verificar se o serviço está rodando
if ! systemctl is-active --quiet postgresql; then
    echo -e "${YELLOW}${WARNING} PostgreSQL não está rodando. Tentando iniciar...${NC}"
    sudo systemctl start postgresql
    
    if systemctl is-active --quiet postgresql; then
        echo -e "${GREEN}${SUCCESS} PostgreSQL iniciado com sucesso${NC}"
    else
        echo -e "${RED}${ERROR} Falha ao iniciar PostgreSQL${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}${SUCCESS} PostgreSQL está rodando${NC}"
fi

echo ""
echo -e "${BLUE}${DATABASE} Extraindo configurações do arquivo .env...${NC}"

# Localizar o diretório raiz do projeto (2 níveis acima de scripts/db/)
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ENV_FILE="${PROJECT_ROOT}/.env"

# Verificar se o arquivo .env existe
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}${WARNING} Arquivo .env não encontrado em: $ENV_FILE${NC}"
    echo -e "${INFO} Usando valores padrão...${NC}"
    DB_USER="rapport_pix"
    DB_PASSWORD="rapport_pix_2024_secure"
    DB_NAME="rapport_pix"
    DB_HOST="localhost"
    DB_PORT="5432"
else
    echo -e "${GREEN}${SUCCESS} Arquivo .env encontrado${NC}"
    
    # Extrair DATABASE_URL do .env
    DATABASE_URL=$(grep -E "^DATABASE_URL=" "$ENV_FILE" | cut -d '=' -f2- | tr -d '"' | tr -d "'")
    
    if [ -z "$DATABASE_URL" ]; then
        echo -e "${YELLOW}${WARNING} DATABASE_URL não encontrada no .env${NC}"
        echo -e "${INFO} Usando valores padrão...${NC}"
        DB_USER="rapport_pix"
        DB_PASSWORD="rapport_pix_2024_secure"
        DB_NAME="rapport_pix"
        DB_HOST="localhost"
        DB_PORT="5432"
    else
        echo -e "${GREEN}${SUCCESS} DATABASE_URL encontrada${NC}"
        
        # Parse da URL PostgreSQL: postgresql://user:password@host:port/database
        # Remover o prefixo postgresql://
        DB_STRING="${DATABASE_URL#postgresql://}"
        
        # Extrair usuário e senha (antes do @)
        USER_PASS="${DB_STRING%%@*}"
        DB_USER="${USER_PASS%%:*}"
        DB_PASSWORD="${USER_PASS#*:}"
        
        # Extrair host, porta e database (depois do @)
        HOST_PORT_DB="${DB_STRING#*@}"
        HOST_PORT="${HOST_PORT_DB%%/*}"
        DB_NAME="${HOST_PORT_DB#*/}"
        
        # Separar host e porta
        DB_HOST="${HOST_PORT%%:*}"
        DB_PORT="${HOST_PORT#*:}"
        
        # Se não houver porta especificada, usar padrão
        if [ "$DB_PORT" = "$DB_HOST" ]; then
            DB_PORT="5432"
        fi
        
        echo -e "${BLUE}${INFO} Configurações extraídas:${NC}"
        echo "  • Usuário: $DB_USER"
        echo "  • Senha: ${DB_PASSWORD:0:4}****"
        echo "  • Host: $DB_HOST"
        echo "  • Porta: $DB_PORT"
        echo "  • Banco: $DB_NAME"
    fi
fi

echo ""
echo -e "${BLUE}${DATABASE} Criando usuário e banco de dados...${NC}"
echo ""

# Gerar SQL dinâmico com as credenciais extraídas
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMP_SQL_FILE=$(mktemp)

# Garantir permissões de leitura para o arquivo temporário
chmod 644 "$TEMP_SQL_FILE"

cat > "$TEMP_SQL_FILE" << EOF
-- ============================================================================
-- Script de Configuração do Banco de Dados PostgreSQL (Gerado Automaticamente)
-- Projeto: Rapport-PIX (ESP32 PIX Frontend)
-- ============================================================================

-- Criar usuário dedicado para o projeto
CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';

-- Criar banco de dados dedicado
CREATE DATABASE ${DB_NAME}
    WITH 
    OWNER = ${DB_USER}
    ENCODING = 'UTF8'
    LC_COLLATE = 'C.UTF-8'
    LC_CTYPE = 'C.UTF-8'
    TEMPLATE = template0
    CONNECTION LIMIT = -1;

-- Comentário descritivo do banco
COMMENT ON DATABASE ${DB_NAME} IS 'Banco de dados do projeto Rapport-PIX - Sistema de pagamentos PIX com ESP32';

-- Conceder privilégios ao usuário
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};

-- Conectar ao banco criado para configurações adicionais
\c ${DB_NAME}

-- Conceder privilégios no schema public
GRANT ALL ON SCHEMA public TO ${DB_USER};
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ${DB_USER};
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ${DB_USER};

-- Configurar privilégios padrão para objetos futuros
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${DB_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${DB_USER};
EOF

# Executar como usuário postgres
sudo -u postgres psql -f "$TEMP_SQL_FILE"
EXIT_CODE=$?

# Remover arquivo temporário
rm -f "$TEMP_SQL_FILE"

if [ $EXIT_CODE -eq 0 ]; then
    echo ""
    echo -e "${GREEN}${SUCCESS} Banco de dados criado com sucesso!${NC}"
    echo ""
    echo -e "${BLUE}${INFO} Detalhes da configuração:${NC}"
    echo "  • Banco de dados: $DB_NAME"
    echo "  • Usuário: $DB_USER"
    echo "  • Senha: ${DB_PASSWORD:0:4}****"
    echo "  • Host: $DB_HOST"
    echo "  • Porta: $DB_PORT"
    echo ""
    echo -e "${YELLOW}${WARNING} IMPORTANTE:${NC}"
    echo "  1. Altere a senha em produção!"
    echo "  2. Verifique se o arquivo .env está configurado corretamente"
    echo "  3. Consulte SENSIBLE.md para mais detalhes"
    echo ""
    echo -e "${BLUE}${INFO} DATABASE_URL configurada:${NC}"
    echo "  DATABASE_URL=\"postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}\""
    echo ""
    
    # Testar conexão
    echo -e "${BLUE}${INFO} Testando conexão...${NC}"
    if PGPASSWORD="${DB_PASSWORD}" psql -U "${DB_USER}" -d "${DB_NAME}" -h "${DB_HOST}" -p "${DB_PORT}" -c "SELECT version();" > /dev/null 2>&1; then
        echo -e "${GREEN}${SUCCESS} Conexão testada com sucesso!${NC}"
        
        # Exibir estatísticas do banco
        echo ""
        echo -e "${BLUE}${INFO} Estatísticas do banco de dados:${NC}"
        STATS=$(PGPASSWORD="${DB_PASSWORD}" psql -U "${DB_USER}" -d "${DB_NAME}" -h "${DB_HOST}" -p "${DB_PORT}" -t -c "SELECT pg_size_pretty(pg_database_size('${DB_NAME}')) as size;" 2>/dev/null | xargs)
        if [ -n "$STATS" ]; then
            echo "  📊 Tamanho do banco: $STATS"
        fi
    else
        echo -e "${YELLOW}${WARNING} Não foi possível testar a conexão automaticamente${NC}"
        echo -e "${INFO} Teste manualmente com: psql -U ${DB_USER} -d ${DB_NAME} -h ${DB_HOST} -p ${DB_PORT}${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}${ROCKET} Setup concluído!${NC}"
else
    echo ""
    echo -e "${RED}${ERROR} Erro ao criar banco de dados${NC}"
    echo -e "${INFO} Verifique os logs acima para mais detalhes${NC}"
    exit 1
fi
