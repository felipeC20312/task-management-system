# Sistema de Gestão de Tarefas Colaborativo

Olá, equipe JungleGaming!
Antes de mais nada, obrigado pelo desafio — Me permitiu explorar uma porção de tecnologias que eu já estava planejando estudar. Trabalhar nesse projeto me permitiu consolidar práticas arquiteturais que admiro e experimentar uma stack que sempre esteve no meu radar.

Durante o desenvolvimento, precisei conciliar outras entregas no mesmo período, então meu foco foi direcionado para construir a espinha dorsal mais sólida, clara e escalável possível dentro do prazo estabelecido. Priorizo sempre entregar algo funcional, bem estruturado e alinhado com o que considero um caminho técnico sustentável — e foi exatamente isso que busquei aqui.

Espero que a solução apresentada transmita meu cuidado com arquitetura, organização do código e decisões técnicas. Fico à disposição para esclarecer pontos, discutir melhorias ou evoluir qualquer parte do projeto.

---

## Estrutura do Projeto

```
task-management-system
├── apps
│   ├── api-gateway
│   ├── auth-service
│   │   ├── src
│   │   ├── Dockerfile
│   │   ├── README.md
│   │   ├── eslint.config.mjs
│   │   ├── nest-cli.json
│   │   ├── package.json
│   │   ├── tsconfig.build.json
│   │   └── tsconfig.json
│   ├── notifications-service
│   ├── tasks-service
│   └── web
├── packages
│   ├── config
│   ├── database
│   └── types
├── build-sequential.sh
├── docker-compose.yml
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

---

## Arquitetura Geral

O sistema segue um modelo de microserviços leves, organizados em um monorepo com Turborepo. Cada serviço possui responsabilidades bem delimitadas e comunica-se através de mensageria assíncrona via RabbitMQ.

### Visão Geral

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Web     │    │  API Gateway    │    │   Auth Service  │
│   (TanStack     │◄──►│   (NestJS)      │◄──►│   (NestJS)      │
│    Router)      │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Tasks Service   │    │ Notifications   │    │   PostgreSQL    │
│   (NestJS)      │◄──►│   Service       │    │   Database      │
│                 │    │   (NestJS)      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 ▼
                    ┌─────────────────┐
                    │   RabbitMQ      │
                    │   Message Bus   │
                    └─────────────────┘

```

---

## Componentes Principais

- **API Gateway**: Ponto de entrada HTTP, autenticação JWT, rate limiting, Swagger docs
- **Auth Service**: Gerenciamento de usuários, login/register, JWT tokens
- **Tasks Service**: CRUD de tarefas, comentários, histórico, atribuições múltiplas
- **Notifications Service**: Processamento de eventos, persistência de notificações
- **Web Frontend**: Interface React com autenticação, listagem de tarefas
- **PostgreSQL**: Banco de dados principal
- **RabbitMQ**: Mensageria assíncrona entre serviços

---

## Decisões Técnicas e Trade-offs

### Tecnologias Escolhidas

- **NestJS**: Framework robusto para Node.js com excelente suporte a microserviços, decorators e injeção de dependência
- **TypeORM**: ORM moderno com suporte a migrations, relacionamentos complexos e TypeScript
- **RabbitMQ**: Message broker confiável para comunicação assíncrona entre serviços
- **React + TanStack Router**: Roteamento moderno e performático para SPAs
- **shadcn/ui + Tailwind**: UI consistente e acessível com design system
- **Turborepo**: Monorepo eficiente com cache e paralelização de builds

### Trade-offs

- **Microserviços vs Monolito**: Escolhi microserviços para demonstrar arquitetura escalável, mas aumenta complexidade de desenvolvimento e deployment. Para um projeto pequeno, um monolito seria mais simples.
- **TypeORM vs Prisma**: TypeORM oferece mais controle sobre queries complexas e migrations, mas Prisma tem DX superior e geração automática de tipos.
- **RabbitMQ vs Kafka**: RabbitMQ é mais simples para começar e suporta patterns como RPC, mas Kafka escala melhor para high-throughput.
- **TanStack Router vs React Router**: Melhor performance e TypeScript support, mas ecossistema menor que React Router.

## Problemas Conhecidos e Melhorias

### Funcionalidades Não Implementadas

1. **WebSocket para Notificações em Tempo Real**: O sistema persiste notificações mas não entrega via WebSocket. Implementar Socket.IO no API Gateway e conectar no frontend.
2. **Página de Detalhe da Tarefa**: Frontend tem apenas listagem. Adicionar página com comentários e histórico.
3. **Comentários no Frontend**: Backend suporta comentários, mas UI não implementada.
4. **Rate Limiting**: Configurado mas não testado adequadamente.
5. **Health Checks**: Não implementados nos serviços.
6. **Testes**: Ausentes (unitários, integração, e2e).
7. **Logging Centralizado**: Apenas console logs básicos.
8. **Docker Compose**: Serviços comentados, apenas DB e RabbitMQ ativos.

### Melhorias Sugeridas

1. **Implementar WebSocket**: Adicionar Socket.IO no API Gateway para notificações real-time
2. **Completar Frontend**: Adicionar páginas de detalhe, comentários, notificações
3. **Adicionar Testes**: Jest para unitários, Supertest para API, Cypress para e2e
4. **Monitoring**: Winston para logs estruturados, health checks, métricas
5. **Security**: Helmet, CORS mais restritivo, validação de input mais robusta
6. **Performance**: Cache Redis, otimização de queries, lazy loading
7. **CI/CD**: GitHub Actions para build, test e deploy automatizad

---

## Estimativa de Tempo Empregado

| Etapa                                             | Tempo Aproximado |
| ------------------------------------------------- | ---------------- |
| Setup do monorepo, Turborepo e bases dos serviços | 8h               |
| Auth Service + API Gateway                        | 8h               |
| Tasks Service + eventos RabbitMQ                  | 8h               |
| Notifications Service + Web inicial               | 8h               |
| Refinamentos, debugging e documentação            | 6h               |
| **Total**                                         | **~38h**         |

---

## Como Executar

### Pré-requisitos

- Node.js 18+
- pnpm
- Docker + Docker Compose

### Instalação

```bash
git clone <repository-url>
cd task-management-system
pnpm install
```

### Configuração de ambiente

Copiar `.env.example` para `.env.development` em cada serviço.

### Executar usando Docker Compose

```bash
docker-compose up -d
```

Para executar os serviços de aplicação, descomente-os no `docker-compose.yml`.

### Ou executar localmente

```bash
# DB + RabbitMQ
docker-compose up db rabbitmq

# API and Services
cd apps/auth-service && pnpm run start:dev
cd apps/tasks-service && pnpm run start:dev
cd apps/notifications-service && pnpm run start:dev
cd apps/api-gateway && pnpm run start:dev

# Frontend
cd apps/web && pnpm run dev
```

### Acessos

- Frontend: [http://localhost:3000](http://localhost:3000)
- API Gateway: [http://localhost:3001](http://localhost:3001)
- Swagger: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)
- RabbitMQ: [http://localhost:15672](http://localhost:15672) (admin/admin)

---

## Scripts

```bash
pnpm run build
pnpm run dev
pnpm run lint
pnpm run type-check
```

---

## Stack Tecnológica

### Backend

- **NestJS**: Framework para Node.js
- **TypeORM**: ORM para TypeScript
- **PostgreSQL**: Banco de dados relacional
- **RabbitMQ**: Message broker
- **JWT**: Autenticação
- **bcrypt**: Hash de senhas
- **class-validator**: Validação de DTOs

### Frontend

- **React 18**: Biblioteca UI
- **TanStack Router**: Roteamento
- **shadcn/ui**: Componentes UI
- **Tailwind CSS**: Styling
- **Axios**: HTTP client
- **React Hook Form + Zod**: Formulários e validação

### DevOps

- **Docker**: Containerização
- **Turborepo**: Monorepo management
- **ESLint + Prettier**: Code quality
