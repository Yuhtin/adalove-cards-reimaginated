<img src="/documentos/assets/adalove2.png" height=100 width=100 />

# AdaLove 2.0

###### Autoestudar ficou mais fácil!

Uma aplicação web moderna para gerenciamento de atividades acadêmicas, desenvolvida com **Next.js** (frontend) e **Node.js/Express** (backend), utilizando **PostgreSQL** como banco de dados. O projeto segue arquitetura MVC e oferece uma interface moderna com design glassmorphism.

## Descrição do Projeto

O **AdaLove 2.0** é uma reimaginação completa da plataforma original, focada em proporcionar uma experiência superior para gestão de atividades de autoestudo. A aplicação permite que estudantes do Inteli importem dados do AdaLove 1.0 e gerenciem suas atividades através de uma interface moderna e intuitiva.

### Principais Diferenciais

- **Interface Moderna**: Design glassmorphism com cores da marca AdaLove
- **Importação de Dados**: Suporte completo para arquivos do AdaLove 1.0
- **Visualizações Múltiplas**: Timeline e tabela para diferentes necessidades
- **Filtros Avançados**: Por tipo, status, semana, instrutor e busca textual
- **Processamento em Background**: Importação de grandes volumes de dados
- **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile

## Requisitos do Sistema

### Backend

- **Node.js** 16.x ou superior
- **PostgreSQL** 12.x ou superior
- **npm** ou **yarn**

### Frontend

- **Node.js** 18.x ou superior (para Next.js 15)
- **npm** ou **yarn**

## Instalação e Configuração

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/adalove-cards-reimaginated.git
cd adalove-cards-reimaginated
```

### 2. Configurar o Backend

```bash
# Navegar para o diretório do servidor
cd server

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
```

**Edite o arquivo `.env` com suas configurações:**

```env
# Configurações do Banco de Dados
DB_USER=seu_usuario_postgres
DB_HOST=localhost
DB_DATABASE=adalove2_db
DB_PASSWORD=sua_senha
DB_PORT=5432
DB_SSL=false

# Configurações do Servidor
PORT=3000
JWT_SECRET=seu_jwt_secret_muito_seguro
```

### 3. Configurar o Frontend

```bash
# Em um novo terminal, navegar para o diretório do cliente
cd client

# Instalar dependências
npm install
```

### 4. Configurar o Banco de Dados

```bash
# Executar as migrações
npm run init-db
```

Este comando criará todas as tabelas necessárias conforme o esquema do AdaLove 2.0.

## Funcionalidades Implementadas

### Autenticação e Segurança

- **Sistema de Login/Registro** com validação robusta
- **Autenticação JWT** com tokens seguros de 7 dias
- **Gerenciamento de Perfil** com atualização de dados pessoais
- **Alteração de Senha** com verificação de senha atual

### Dashboard e Visualizações

- **Dashboard Interativo** com estatísticas em tempo real
- **Cards de Progresso** mostrando atividades por status
- **Visualização Timeline** cronológica das atividades
- **Visualização em Tabela** para análise comparativa
- **Navegação por Semanas** com indicadores visuais de progresso

### Filtros e Busca Avançada

- **Filtros por Tipo de Atividade** (Orientação, Instrução, Autoestudo, Artefatos)
- **Filtros por Status** (A fazer, Fazendo, Feito)
- **Filtros por Semana** (1-10 semanas do curso)
- **Busca por Instrutor** com correspondência parcial
- **Busca Textual** em nomes e descrições de atividades

### Importação de Dados da AdaLove Oficial

- **Upload de Arquivos JSON** com validação rigorosa
- **Processamento em Background** para grandes volumes
- **Monitoramento de Progresso** em tempo real
- **Histórico de Importações** com status detalhado
- **Rate Limiting** para proteção contra abuso

### Análise e Relatórios

- **Gráficos de Progresso Semanal** com dados agregados
- **Distribuição por Tipo de Atividade**
- **Tendências Mensais** de conclusão
- **Estatísticas Personalizadas** por usuário

### Interface e Experiência

- **Design Glassmorphism** moderno e elegante
- **Cores da Marca AdaLove** (#E30614, #F24444)
- **Interface Responsiva** para todos os dispositivos
- **Estados de Loading** e feedback visual
- **Empty States** com orientações claras
- **Animações Suaves** e transições fluidas

### Funcionalidades Técnicas

- **API RESTful** completa com documentação
- **Validação de Dados** client-side e server-side
- **Tratamento de Erros** robusto
- **Logs de Sistema** com Winston
- **Testes Automatizados** com Jest
- **CORS Configurado** para desenvolvimento e produção

## Executando a Aplicação

### Desenvolvimento

**Terminal 1 - Backend:**

```bash
cd server
npm run dev
# Servidor rodando em http://localhost:3000
```

**Terminal 2 - Frontend:**

```bash
cd client
npm run dev
# Interface rodando em http://localhost:3001
```

### Produção

**Backend:**

```bash
cd server
npm start
```

**Frontend:**

```bash
cd client
npm run build
npm start
```

## Scripts Disponíveis

### Backend (server/)

- `npm start` - Inicia o servidor em modo produção
- `npm run dev` - Inicia com nodemon (desenvolvimento)
- `npm run init-db` - Inicializa o banco de dados

### Frontend (client/)

- `npm run dev` - Inicia em modo desenvolvimento (porta 3001)
- `npm run build` - Gera build de produção
- `npm start` - Inicia build de produção
- `npm run lint` - Executa linting do código

## Estrutura do Projeto

```bash
adalove-cards-reimaginated/
├── client/                          # Frontend Next.js
│   ├── src/
│   │   ├── app/                     # App Router do Next.js
│   │   │   ├── components/          # Componentes React reutilizáveis
│   │   │   │   ├── ui/              # Componentes de interface
│   │   │   │   ├── selfstudy/       # Componentes específicos de autoestudo
│   │   │   │   └── dashboard/       # Componentes do dashboard
│   │   │   ├── dashboard/           # Página do dashboard
│   │   │   ├── login/               # Página de login
│   │   │   ├── register/            # Página de registro
│   │   │   ├── selfstudy/           # Página de autoestudos
│   │   │   └── globals.css          # Estilos globais
│   │   ├── contexts/                # Contextos React (Auth, Theme)
│   │   └── lib/                     # Utilitários e APIs
│   ├── public/                      # Arquivos estáticos
│   ├── package.json                 # Dependências do frontend
│   └── tailwind.config.js           # Configuração do Tailwind CSS
│
├── server/                          # Backend Node.js/Express
│   ├── config/                      # Configurações (banco, JWT)
│   ├── controllers/                 # Controladores (lógica de negócio)
│   │   ├── authController.js        # Autenticação e perfil
│   │   ├── studentActivityController.js  # Atividades de estudante
│   │   ├── sectionController.js     # Seções/turmas
│   │   └── dataImportController.js  # Importação de dados
│   ├── models/                      # Modelos de dados
│   │   ├── userModel.js             # Modelo de usuários
│   │   ├── studentActivityModel.js  # Modelo de atividades
│   │   ├── sectionModel.js          # Modelo de seções
│   │   └── activityModel.js         # Modelo de atividades base
│   ├── routes/                      # Rotas da API
│   │   ├── authRoutes.js            # Rotas de autenticação
│   │   ├── studentActivityRoutes.js # Rotas de atividades
│   │   ├── sectionRoutes.js         # Rotas de seções
│   │   └── dataRoutes.js            # Rotas de importação
│   ├── migrations/                  # Scripts SQL do banco
│   ├── scripts/                     # Scripts utilitários
│   ├── package.json                 # Dependências do backend
│   └── server.js                    # Arquivo principal do servidor
│
├── documentos/                      # Documentação do projeto
│   ├── assets/                      # Imagens e diagramas
│   └── wad.md                       # Web Application Document
│
├── readme.md                        # Este arquivo
└── test_apis.sh                     # Script de teste das APIs
```

## Modelo de Banco de Dados

O AdaLove 2.0 utiliza **PostgreSQL** com um esquema otimizado para suportar a estrutura oficial do AdaLove 1.0:

### Entidades Principais

- **`users`** - Informações dos usuários (id UUID, username, email, senha hash)
- **`sections`** - Seções/turmas do AdaLove (projetos, orientadores, datas)
- **`activities`** - Atividades base de cada seção (nome, descrição, instrutor)
- **`student_activities`** - Relação estudante-atividade (status, notas, avaliações)
- **`activity_types`** - Tipos: Orientação, Instrução, Autoestudo, Artefatos
- **`status_types`** - Status: A fazer, Fazendo, Feito

### Características Técnicas

- **UUIDs** como chaves primárias (compatibilidade com AdaLove 1.0)
- **Relacionamentos** bem definidos com foreign keys
- **Índices** otimizados para consultas frequentes
- **Constraints** para integridade dos dados
- **Suporte a SSL** para conexões seguras

**Documentação Completa**: [Web Application Document (WAD)](documentos/wad.md)

## Tecnologias Utilizadas

### Frontend

- **Next.js 15** - Framework React com App Router
- **React 19** - Biblioteca de interface de usuário
- **Tailwind CSS** - Framework de estilização
- **Framer Motion** - Animações e transições
- **Recharts** - Gráficos e visualizações
- **Axios** - Cliente HTTP para APIs

### Backend

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação com tokens
- **bcrypt** - Hash de senhas
- **Multer** - Upload de arquivos
- **Winston** - Sistema de logs

### DevOps e Qualidade

- **ESLint** - Linting de código
- **Nodemon** - Desenvolvimento com hot reload
- **CORS** - Configuração de segurança
- **Rate Limiting** - Proteção contra abuso

## Documentação Adicional

- **[WAD - Web Application Document](documentos/wad.md)** - Documentação técnica completa
- **[API Documentation](documentos/wad.md#23-webapi-e-endpoints)** - Endpoints e exemplos
- **[Interface Documentation](documentos/wad.md#27-interface-e-navegação)** - Guia da interface

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a **Licença MIT** - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

**AdaLove 2.0** - Autoestudar ficou mais fácil!
