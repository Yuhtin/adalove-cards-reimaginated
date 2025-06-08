<img src="/documentos/assets/adalove2.png" height=100 width=100 />

# AdaLove 2

Este projeto é uma aplicação web para gerenciamento de cards de atividades do AdaLove, desenvolvido utilizando Node.js com Express.js como framework e PostgreSQL como banco de dados relacional, seguindo o padrão MVC (Model-View-Controller).

## Descrição do Projeto

A aplicação AdaLove Reimaginated é uma plataforma para gerenciar cartões de atividades de aprendizado de forma prática e eficiente. O sistema permite que alunos do Inteli importem seus cartões de atividades e os gerenciem de uma forma mais simplificada, categorizando-os por tipo, status, instrutor e outras propriedades relevantes.

## Requisitos

- Node.js (versão 14.x ou superior)
- PostgreSQL (versão 12.x ou superior)

## Instalação

1. **Clonar o repositório:**

```bash
   git clone https://github.com/seu-usuario/adalove-cards-reimaginated.git
   cd adalove-cards-reimaginated
```

2. **Instalar as dependências:**

```bash
npm install
```

3. **Configurar o arquivo `.env`:**

Renomeie o arquivo `.env.example` para `.env` e configure as variáveis de ambiente necessárias, como as configurações do banco de dados PostgreSQL.

Configuração do Banco de Dados
------------------------------

1. **Criar banco de dados:**

    Crie um banco de dados PostgreSQL com o nome especificado no seu arquivo `.env`.

2. **Executar o script SQL de inicialização:**

```bash
npm run init-db
```

Isso criará todas as tabelas necessárias no seu banco de dados PostgreSQL conforme o modelo relacional da aplicação.

Funcionalidades
---------------

- **Gerenciamento Simplificado de Atividades Acadêmicas**: Organize todas suas atividades do Inteli em um só lugar! Com nossa plataforma, você pode visualizar, criar e organizar seus cartões de atividades de forma intuitiva, sem precisar navegar por múltiplos sistemas.

- **Sistema de Categorização Inteligente**: Encontre rapidamente o que precisa! Nosso sistema permite filtrar suas atividades por disciplina, data, professor ou tipo de atividade, ajudando você a focar no que realmente importa no momento.

- **Painel Personalizado**: Tenha uma visão clara do seu progresso acadêmico em um dashboard customizado que mostra suas atividades pendentes, em andamento e concluídas em um piscar de olhos.

- **Localização Integrada**: Nossa função exclusiva de localização sugere estudos baseados em onde você está - recomendações diferentes quando estiver na biblioteca, no laboratório ou em casa!

- **Painel Administrativo Prático**: Área especial para coordenadores e professores acompanharem o progresso dos alunos, identificando rapidamente áreas que precisam de mais atenção.

- **Planejamento Semanal Inteligente**: Esqueça as planilhas! Nossa ferramenta automaticamente organiza suas atividades em um planner semanal que respeita seu estilo de estudo e ritmo de aprendizado.

---

**AdaLove 2** - Simplificando sua vida acadêmica para que você possa focar no que realmente importa: aprender.

Scripts Disponíveis
-------------------

- `npm start`: Inicia o servidor Node.js.
- `npm run dev`: Inicia o servidor com `nodemon`, reiniciando automaticamente após alterações no código.
- `npm run test`: Executa os testes automatizados.
- `npm run test:coverage`: Executa os testes e gera um relatório de cobertura de código.

Estrutura de Diretórios
-----------------------

- **`assets/`**: Arquivos estáticos como favicon.ico.
- **`config/`**: Configurações do banco de dados e outras configurações do projeto.
- **`controllers/`**: Controladores da aplicação (lógica de negócio).
- **`documentos/`**: Documentação do projeto, incluindo WAD e diagramas.
- **`migrations/`**: Scripts SQL para criação e atualização do banco de dados.
- **`models/`**: Modelos da aplicação (definições de dados e interações com o banco de dados).
- **`routes/`**: Rotas da aplicação.
- **`scripts/`**: Scripts utilitários, como inicialização do banco de dados.

Modelo de Banco de Dados
-----------------------

O banco de dados utiliza o PostgreSQL e possui as seguintes entidades principais:

- **Users**: Armazena logins e informações dos usuários
- **Sections**: Armazena seções/turmas do AdaLove
- **Activities**: Armazena as atividades de cada seção
- **Student Activities**: Relaciona estudantes com atividades e seus status
- **Activity Types**: Tipos de atividades (Orientação, Instrução, Autoestudo, Artefatos)
- **Status Types**: Status possíveis para as atividades (A fazer, Fazendo, Feito)

Para **mais informações** sobre a **modelagem do banco de dados**, consulte o arquivo **WAD**.
[Clique aqui para ir até o arquivo](https://github.com/Yuhtin/adalove-cards-reimaginated/blob/main/documentos/wad.md#3-projeto-da-aplica%C3%A7%C3%A3o-web)

Licença
-------

Este projeto está licenciado sob a Licença MIT.

Este README.md fornece uma visão geral clara do boilerplate, incluindo instruções de instalação, configuração do banco de dados, funcionalidades principais, scripts disponíveis, estrutura de diretórios, como contribuir e informações de licença. Certifique-se de personalizar as seções com detalhes específicos do seu projeto conforme necessário.