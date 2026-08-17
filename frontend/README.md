# Frontend - ECMS6

Painel administrativo para o sistema ECMS6.

## Tecnologias

- React 18+ com TypeScript
- Vite (build tool)
- Tailwind CSS (estilização)
- React Router DOM (rotas)
- TanStack Query (gerenciamento de estado do servidor)
- Axios (requisições HTTP)
- Lucide React (ícones)

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:3001` e fará proxy das requisições API para `http://localhost:3000`.

## Build de Produção

```bash
npm run build
```

Os arquivos compilados serão gerados na pasta `dist/`.

## Preview da Build

```bash
npm run preview
```

## Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/       # Componentes reutilizáveis
│   │   ├── Button.tsx
│   │   └── DashboardLayout.tsx
│   ├── context/          # Contextos React
│   │   └── AuthContext.tsx
│   ├── pages/            # Páginas da aplicação
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── CustomersPage.tsx
│   │   └── StoresPage.tsx
│   ├── services/         # Serviços de API
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   ├── customer.service.ts
│   │   └── store.service.ts
│   ├── hooks/            # Hooks personalizados
│   ├── types/            # Tipos TypeScript
│   ├── utils/            # Utilitários
│   │   └── cn.ts
│   ├── App.tsx           # Componente principal
│   ├── main.tsx          # Ponto de entrada
│   └── index.css         # Estilos globais
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do frontend:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

Para produção, altere para a URL da sua API:

```env
VITE_API_URL=https://sua-api.com/api/v1
```

## Funcionalidades

### Autenticação
- Login com email e senha
- Proteção de rotas privadas
- Persistência de token no localStorage
- Logout automático quando token expira

### Dashboard
- Visão geral do sistema
- Cards com estatísticas
- Atividade recente

### Gestão de Clientes
- Listar todos os clientes
- Criar novo cliente
- Editar cliente existente
- Excluir cliente
- Modal de formulário

### Gestão de Lojas
- Listar todas as lojas
- Criar nova loja
- Editar loja existente
- Excluir loja
- Ativar/Desativar loja
- Indicador de status (ativa/inativa)

## Design System

### Cores
- Primary: Blue (#2563EB)
- Secondary: Gray (#4B5563)
- Success: Green (#10B981)
- Danger: Red (#DC2626)
- Warning: Yellow (#F59E0B)

### Componentes
- **Button**: Com variações (primary, secondary, danger, outline) e tamanhos (sm, md, lg)
- **DashboardLayout**: Layout responsivo com sidebar navegável

## Responsividade

O sistema é totalmente responsivo:
- Sidebar colapsável em dispositivos móveis
- Grid de cards adaptável
- Tabelas com scroll horizontal em telas pequenas
