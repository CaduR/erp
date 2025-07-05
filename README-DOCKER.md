# Sistema ERP - Docker

Este documento explica como executar todo o sistema ERP usando Docker.

## 🚀 Início Rápido

### Windows
```bash
# Execute o script de gerenciamento
start-erp.bat
```

### Linux/Mac
```bash
# Execute o script de gerenciamento
./start-erp.sh
```

## 📋 Pré-requisitos

- Docker Desktop instalado e rodando
- Docker Compose instalado
- Portas 80 e 8080 disponíveis

## 🏗️ Arquitetura

O sistema é composto por 3 containers:

1. **PostgreSQL** (porta 5432) - Banco de dados
2. **Backend Spring Boot** (porta 8080) - API REST
3. **Frontend Angular** (porta 80) - Interface web

## 🔧 Comandos Manuais

### Iniciar todo o sistema
```bash
docker-compose up -d
```

### Parar todo o sistema
```bash
docker-compose down
```

### Ver logs
```bash
# Logs do backend
docker-compose logs -f backend

# Logs do frontend
docker-compose logs -f frontend

# Logs do banco
docker-compose logs -f postgres
```

### Acessar banco de dados
```bash
docker exec -it erp-postgres psql -U postgres -d erp
```

## 🌐 URLs de Acesso

Após iniciar o sistema:

- **Frontend (Interface Web):** http://localhost
- **Backend API:** http://localhost:8080
- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **Health Check:** http://localhost:8080/actuator/health

## 🔐 Credenciais

**Usuário Administrador:**
- **Usuário:** `admin`
- **Senha:** `admin123`

## 📁 Estrutura de Arquivos

```
erp/
├── docker-compose.yml          # Configuração dos containers
├── start-erp.bat              # Script Windows
├── start-erp.sh               # Script Linux/Mac
├── erp/
│   ├── Dockerfile             # Container do backend
│   └── src/main/resources/
│       └── application-docker.properties
└── erp-frontend/
    ├── Dockerfile             # Container do frontend
    └── nginx.conf             # Configuração do nginx
```

## 🔄 Desenvolvimento

### Modo Desenvolvimento (sem Docker)
```bash
# Backend
cd erp
./mvnw spring-boot:run

# Frontend (em outro terminal)
cd erp-frontend
npm start
```

### Modo Docker
```bash
# Iniciar tudo
docker-compose up -d

# Ver logs em tempo real
docker-compose logs -f
```

## 🛠️ Troubleshooting

### Porta já em uso
```bash
# Verificar processos usando as portas
netstat -ano | findstr :80
netstat -ano | findstr :8080

# Parar processos se necessário
taskkill /PID <PID> /F
```

### Container não inicia
```bash
# Ver logs detalhados
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

### Limpar tudo e recomeçar
```bash
docker-compose down -v
docker system prune -f
docker-compose up -d
```

## 📝 Notas Importantes

1. **Banco de Dados:** O banco é recriado a cada inicialização (`create-drop`)
2. **Usuário Admin:** Criado automaticamente na primeira execução
3. **Volumes:** Os dados do PostgreSQL são persistidos em volume Docker
4. **Rede:** Todos os containers compartilham a rede `erp-network`

## 🔧 Configurações

### Variáveis de Ambiente (Backend)
- `SPRING_DATASOURCE_URL`: URL do banco PostgreSQL
- `SPRING_DATASOURCE_USERNAME`: Usuário do banco
- `SPRING_DATASOURCE_PASSWORD`: Senha do banco
- `SPRING_JPA_HIBERNATE_DDL_AUTO`: Estratégia de criação do schema
- `SPRING_PROFILES_ACTIVE`: Perfil ativo (docker)

### Configurações do Nginx (Frontend)
- Proxy reverso para API do backend
- Configuração CORS
- Suporte a SPA (Single Page Application) 