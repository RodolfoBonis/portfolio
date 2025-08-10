# GitHub Actions Workflows

Este diretório contém os workflows do GitHub Actions para CI/CD do portfolio.

## 📋 Workflows Disponíveis

### 🔄 CI (ci.yml)
- **Trigger**: Push/PR para `main` (exceto `version.txt`)
- **Função**: Lint, Prettier, testes de qualidade
- **Ambientes**: Todos os pushes

### 🚀 CD (cd.yml) - Produção Automática
- **Trigger**: Após CI bem-sucedido na branch `main`
- **Função**: 
  - Incrementa versão automaticamente
  - Build e push da imagem Docker
  - Atualiza `clusters/prod/portfolio-app.yaml` no k3s-apps
  - Sync ArgoCD produção (`portfolio-app-prod`)
  - Cria release no GitHub
- **Ambiente**: Produção (`portfolio`)

### 🧪 Deploy to Staging (deploy-staging.yml) - Manual
- **Trigger**: Manual via GitHub UI
- **Função**:
  - Deploy manual para staging
  - Opção de usar imagem existente ou buildar nova
  - Versão com sufixo `-stg-{commit}`
  - Atualiza `clusters/dev/portfolio-app.yaml`
  - Sync ArgoCD staging (`portfolio-app-stg`)
- **Ambiente**: Staging (`portfolio-stg`)

### 🎯 Deploy Specific Version (deploy-version.yml) - Manual
- **Trigger**: Manual via GitHub UI
- **Função**:
  - Deploy de qualquer versão existente
  - Escolha de ambiente (staging/production)
  - Verificação se imagem existe no ECR
  - Útil para rollbacks ou testes
- **Ambientes**: Staging ou Produção (escolha manual)

## 🎮 Como Usar

### Deploy Automático para Produção
1. Faça commit na branch `main`
2. CI roda automaticamente
3. Se CI passar → CD roda automaticamente
4. Nova versão em produção ✅

### Deploy Manual para Staging
1. Vá em **Actions** → **Deploy to Staging**
2. Clique **Run workflow**
3. Escolha opções:
   - Versão específica (opcional)
   - Usar imagem existente (opcional)
4. Deploy no staging ✅

### Deploy de Versão Específica
1. Vá em **Actions** → **Deploy Specific Version**
2. Clique **Run workflow**
3. Informe:
   - Versão (ex: `1.5.0`, `1.4.3-stg-abc123`)
   - Ambiente (staging/production)
4. Deploy da versão escolhida ✅

## 🏗️ Estrutura de Versões

- **Produção**: `1.5.0`, `1.4.3` (semver limpo)
- **Staging**: `1.5.0-stg-abc123` (com sufixo commit)

## 🔧 Configuração Necessária

### Secrets no GitHub:
- `GH_TOKEN` - Token GitHub
- `AWS_ACCESS_KEY_ID` - AWS ECR
- `AWS_SECRET_ACCESS_KEY` - AWS ECR  
- `AWS_REGION` - Região AWS
- `ARGOCD_SERVER` - URL do ArgoCD
- `ARGOCD_TOKEN` - Token ArgoCD
- `BOTTOKEN` - Telegram Bot
- `CHAT_ID` - Chat Telegram

### Repositórios:
- **Atual**: Código fonte da aplicação
- **k3s-apps**: Manifests Kubernetes/ArgoCD