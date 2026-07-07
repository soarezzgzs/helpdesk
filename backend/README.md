# 🚀 HelpDesk Backend

API REST responsável pelo gerenciamento completo do sistema HelpDesk.

Projeto desenvolvido utilizando Node.js, Express, Prisma ORM e PostgreSQL.

---

## 🚀 Tecnologias

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- Bcrypt
- Zod

---

## 📦 Funcionalidades

### Autenticação

- Login
- Geração de JWT
- Proteção de rotas
- Controle por perfil

### Clientes

- Cadastro
- Atualização de perfil
- Upload de avatar
- Remoção de avatar
- Alteração de senha

### Técnicos

- Cadastro
- Atualização
- Disponibilidade
- Atendimento de chamados

### Chamados

- Criação
- Atualização
- Encerramento
- Serviços adicionais

### Serviços

- Cadastro
- Edição
- Ativação
- Desativação

---

## 🗄 Banco de Dados

Banco utilizado:

```txt
PostgreSQL
```

ORM:

```txt
Prisma ORM
```

---

## 📂 Estrutura

```txt
src
├── configs
├── controllers
├── database
├── middlewares
├── routes
├── services
├── types
└── utils
```

---

## 🔐 Controle de Acesso

Perfis disponíveis:

```txt
CLIENT
TECHNICIAN
ADMIN
```

Cada perfil possui permissões específicas de acesso.

---

## ⚙️ Variáveis de Ambiente

Arquivo:

```env
.env
```

Exemplo:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=seu_secret
PORT=3333
```

---

## 🚀 Executar Localmente

Instalar dependências:

```bash
npm install
```

Gerar Prisma Client:

```bash
npx prisma generate
```

Aplicar migrations:

```bash
npx prisma migrate dev
```

Executar servidor:

```bash
npm run dev
```

---

## 📚 Scripts

```bash
npm run dev
```

Executa servidor em modo desenvolvimento.

```bash
npm run build
```

Compila aplicação.

```bash
npm start
```

Executa versão compilada.

```bash
npm run test
```

Executa testes.

---

## 🌎 Deploy

Backend hospedado na:

```txt
Render
```

Banco hospedado em:

```txt
Render PostgreSQL
```

---

## 🔒 Segurança

Implementações:

- Senhas criptografadas com Bcrypt
- JWT Authentication
- Middleware de autorização
- Validação com Zod
- Separação por perfis

---

## 🎓 Sobre o Projeto

Desenvolvido como desafio final da formação Full Stack da Rocketseat.

---

## 👨‍💻 Desenvolvedor

Leonardo Soares

GitHub:
https://github.com/soarezzgzs

Linkedin:
https://www.linkedin.com/in/leonardo-soares-57a19039b/
