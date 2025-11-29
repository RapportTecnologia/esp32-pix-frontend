#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# Script: start-pm2.sh
# Objetivo: Subir a aplicação Next.js em modo produção usando PM2.
# Projeto: esp32-pix-frontend
# Autor: (defina o autor aqui)
# Data: (defina a data de criação aqui)
# Dependências: Node.js, npm/pnpm, pm2 instalado globalmente (`npm i -g pm2`).
# -----------------------------------------------------------------------------

set -eu pipefail

APP_NAME="Café Express"
APP_PORT="${PORT:-6500}"

# Descobre a raiz do projeto (um nível acima da pasta scripts/)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="${SCRIPT_DIR%/scripts}"

cd "$PROJECT_ROOT"

echo "[pm2/start] 🧠 Iniciando aplicação '${APP_NAME}' em modo produção na porta ${APP_PORT}..."

# Opcional: garantir instalação de dependências (comente se não quiser isso em produção)
if [ ! -d "node_modules" ]; then
  echo "[pm2/start] ⚠️ Dependências não encontradas. Instalando com npm install..."
  npm install
fi

# Gera o build de produção (se já estiver gerado, o Next.js só atualiza o necessário)
echo "[pm2/start] ⚙️ Gerando build de produção (npm run build)..."
npm run build

# Sobe a aplicação com PM2 usando o script "start" definido no package.json
# O script de start já usa a variável PORT internamente.
echo "[pm2/start] ✅ Subindo aplicação com PM2 (nome: ${APP_NAME})..."
PORT="${APP_PORT}" pm2 start npm --name "${APP_NAME}" -- start

# Salva o estado atual do PM2 (útil para reboot automático com pm2 resurrect)
echo "[pm2/start] 💾 Salvando estado do PM2 (pm2 save)..."
pm2 save

echo "[pm2/start] ✅ Aplicação '${APP_NAME}' está rodando sob gerenciamento do PM2."
