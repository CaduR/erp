# Sistema ERP

Um sistema ERP (Enterprise Resource Planning) completo desenvolvido com Spring Boot (Backend) e Angular (Frontend).

## 🚀 Tecnologias Utilizadas

### Backend
- **Java 17**
- **Spring Boot 3.x**
- **Spring Security**
- **Spring Data JPA**
- **MySQL/PostgreSQL**
- **Maven**

### Frontend
- **Angular 17**
- **TypeScript**
- **Bootstrap/SCSS**
- **RxJS**

### Infraestrutura
- **Docker**
- **Docker Compose**

## 📋 Módulos do Sistema

### 🛒 Compras
- Gestão de fornecedores
- Pedidos de compra
- Recebimento de mercadorias

### 📦 Estoque
- Cadastro de produtos
- Movimentação de estoque
- Controle de Kardex

### 💰 Financeiro
- Contas a pagar
- Contas a receber
- Fluxo de caixa
- Relatórios financeiros (DRE, Balanço Patrimonial)

### 🛍️ Vendas
- Cadastro de clientes
- PDV (Ponto de Venda)
- Gestão de vendas
- Notas fiscais

### 👥 Segurança
- Gestão de usuários
- Controle de acesso por roles
- Autenticação JWT

## 🛠️ Como Executar

### Pré-requisitos
- Java 17 ou superior
- Node.js 18 ou superior
- Docker e Docker Compose
- Maven

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/erp.git
cd erp
```

### 2. Executar com Docker (Recomendado)
```bash
docker-compose up -d
```

### 3. Executar localmente

#### Backend
```bash
cd erp
mvn spring-boot:run
```

#### Frontend
```bash
cd erp-frontend
npm install
ng serve
```

## 🌐 Acessos

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8080
- **Banco de Dados**: localhost:3306 (MySQL) ou localhost:5432 (PostgreSQL)

## 📊 Estrutura do Projeto

```
erp/
├── erp/                    # Backend Spring Boot
│   ├── src/main/java/
│   │   └── com/cadu/erp/
│   │       ├── compras/    # Módulo de Compras
│   │       ├── estoque/    # Módulo de Estoque
│   │       ├── financeiro/ # Módulo Financeiro
│   │       ├── vendas/     # Módulo de Vendas
│   │       └── security/   # Módulo de Segurança
│   └── src/main/resources/
├── erp-frontend/           # Frontend Angular
│   ├── src/app/
│   │   ├── modules/        # Módulos da aplicação
│   │   ├── shared/         # Componentes compartilhados
│   │   └── core/           # Serviços core
│   └── src/environments/
└── docker-compose.yml      # Configuração Docker
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `application-local.properties` no backend:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/erp
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha

# JWT
jwt.secret=sua_chave_secreta_jwt
jwt.expiration=86400000
```

### Configuração do Frontend

Edite `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

## 📝 Funcionalidades Principais

- ✅ Autenticação e autorização
- ✅ Gestão completa de estoque
- ✅ Controle financeiro
- ✅ Sistema de vendas com PDV
- ✅ Gestão de compras e fornecedores
- ✅ Relatórios gerenciais
- ✅ Interface responsiva
- ✅ API RESTful

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Seu Nome**
- GitHub: [@seu-usuario](https://github.com/seu-usuario)

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas, abra uma [issue](https://github.com/seu-usuario/erp/issues) no GitHub. 