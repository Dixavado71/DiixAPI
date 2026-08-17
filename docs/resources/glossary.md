# ECMS6 - Glossário de Termos

## Índice

- [A](#a)
- [B](#b)
- [C](#c)
- [D](#d)
- [E](#e)
- [F](#f)
- [I](#i)
- [J](#j)
- [K](#k)
- [L](#l)
- [M](#m)
- [N](#n)
- [O](#o)
- [P](#p)
- [Q](#q)
- [R](#r)
- [S](#s)
- [T](#t)
- [U](#u)
- [V](#v)
- [W](#w)

---

## A

### API (Application Programming Interface)
Conjunto de regras e protocolos que permite que diferentes aplicações se comuniquem. No ECMS6, usamos REST API para comunicação entre frontend e backend.

### Audit Log
Registro detalhado de todas as ações significativas no sistema, usado para rastreabilidade e compliance.

### Authorization
Processo de verificar se um usuário/cliente tem permissão para realizar uma ação específica. Diferente de autenticação.

---

## B

### Bot Engine
Motor de conversação inteligente do ECMS6 que gerera interações automatizadas com clientes via WhatsApp.

### Bcrypt
Algoritmo de hash de senhas usado para armazenar credenciais de forma segura.

### Backend
Parte do sistema que roda no servidor, responsável por lógica de negócio, banco de dados e APIs.

---

## C

### Carrinho (Cart)
Estrutura que armazena temporariamente os produtos que um cliente pretende comprar antes de finalizar o pedido.

### Checkout
Processo final de compra onde o cliente confirma itens, informa endereço e escolhe forma de pagamento.

### CORS (Cross-Origin Resource Sharing)
Mecanismo de segurança que permite ou bloqueia requisições entre diferentes domínios.

### Customer
Cliente do sistema, pode ser uma pessoa física ou jurídica que faz compras nas lojas.

### CUID
Tipo de identificador único usado como primary key nas tabelas. Mais eficiente que UUID.

### Cascade Delete
Comportamento do banco de dados que automaticamente deleta registros relacionados quando um registro pai é deletado.

---

## D

### Decimal
Tipo de dado numérico usado para valores financeiros, garantindo precisão exata (sem erros de ponto flutuante).

### Deploy
Processo de colocar a aplicação em produção, tornando-a acessível aos usuários finais.

### Docker
Plataforma de containerização que empacota a aplicação e suas dependências para execução consistente em qualquer ambiente.

---

## E

### Evolution API
API externa que integra o ECMS6 ao WhatsApp, permitindo envio e recebimento de mensagens.

### E2E (End-to-End)
Testes que simulam fluxos completos do usuário, do início ao fim.

### Enum
Tipo de dado que define um conjunto fixo de valores possíveis (ex: OrderStatus: PENDING, PAID, CANCELLED).

### Environment Variables
Variáveis de configuração externas ao código, usadas para settings sensíveis e específicas por ambiente.

---

## F

### Frontend
Interface visual da aplicação que os usuários interagem. No ECMS6, construído com React.

### Foreign Key (Chave Estrangeira)
Campo em uma tabela que referencia a primary key de outra tabela, estabelecendo relacionamento.

### Feature Flag
Técnica para habilitar/desabilitar funcionalidades sem deploy novo.

---

## I

### Idempotência
Propriedade de uma operação que produz o mesmo resultado independentemente de quantas vezes seja executada. Crucial para webhooks.

### Index (Índice)
Estrutura de banco de dados que melhora performance de consultas em colunas específicas.

### Isolation (Isolamento)
Princípio de multi-tenancy onde dados de cada loja são completamente separados dos demais.

---

## J

### JWT (JSON Web Token)
Formato de token usado para autenticação, contendo informações codificadas sobre o usuário.

### JSON (JavaScript Object Notation)
Formato leve de troca de dados, usado extensivamente nas APIs do ECMS6.

---

## K

### KPI (Key Performance Indicator)
Métrica usada para avaliar sucesso de uma funcionalidade ou do sistema como um todo.

---

## L

### LGPD (Lei Geral de Proteção de Dados)
Legislação brasileira que regula coleta e uso de dados pessoais.

### Load Balancer
Dispositivo/software que distribui tráfego entre múltiplos servidores para melhor performance e disponibilidade.

### Logging
Registro de eventos e atividades do sistema para debugging, monitoramento e auditoria.

---

## M

### Multi-Tenancy
Arquitetura onde uma única instância do software serve múltiplos clientes (tenants) de forma isolada.

### Migration
Script que altera estrutura do banco de dados de forma versionada e reversível.

### Middleware
Função que processa requisições HTTP antes de chegarem aos controllers (ex: auth, logging, validation).

### Model
Representação de uma entidade do domínio no código e no banco de dados.

---

## N

### N+1 Query Problem
Problema de performance onde N queries adicionais são executadas para buscar dados relacionados. Solucionado com `include` no Prisma.

### Node.js
Runtime JavaScript que executa o backend do ECMS6.

### Namespace
Espaço de nomes usado para organizar e isolar recursos (ex: chaves Redis por ambiente).

---

## O

### ORM (Object-Relational Mapping)
Técnica que mapeia objetos do código para tabelas do banco. Usamos Prisma ORM.

### Order (Pedido)
Registro de uma compra realizada por um cliente, contendo itens, valores e status.

---

## P

### Primary Key (Chave Primária)
Campo único que identifica cada registro em uma tabela.

### Prisma
ORM moderno usado no ECMS6 para acesso type-safe ao banco de dados.

### Promotion
Regra de desconto aplicável a produtos ou pedidos.

### Payload
Dados enviados no corpo de uma requisição ou webhook.

### PII (Personally Identifiable Information)
Informações que podem identificar uma pessoa (nome, CPF, telefone). Requer proteção especial.

### Pagination
Técnica para dividir grandes conjuntos de dados em páginas menores.

---

## Q

### Query
Consulta ao banco de dados para buscar ou modificar informações.

### Queue (Fila)
Estrutura para processamento assíncrono de tarefas (futuro no ECMS6).

---

## R

### RBAC (Role-Based Access Control)
Sistema de controle de acesso baseado em papéis/funções dos usuários.

### Rate Limiting
Mecanismo que limita número de requisições por IP/usuário em um período.

### Redis
Banco de dados in-memory usado para cache e sessões.

### Repository
Padrão de design que abstrai acesso a dados, isolando lógica de persistence.

### REST (Representational State Transfer)
Arquitetura de API usada no ECMS6, baseada em recursos e métodos HTTP.

### Rollback
Reversão de uma mudança (deploy, migration) para estado anterior.

### Route (Rota)
Endpoint específico da API que responde a uma combinação de método HTTP + URL.

---

## S

### Schema
Estrutura que define organização do banco de dados (tabelas, colunas, relacionamentos).

### Service
Camada de negócio que contém regras e lógica da aplicação.

### SSL/TLS
Protocolos de criptografia para comunicação segura (HTTPS).

### Store (Loja)
Tenant no sistema multi-loja, representa um estabelecimento comercial.

### Singleton
Padrão de design que garante apenas uma instância de uma classe (usado no EvolutionClient).

### Swagger/OpenAPI
Especificação para documentação de APIs (planejado para ECMS6).

---

## T

### Tenant
Cliente/loja isolada no sistema multi-tenancy.

### Transaction
Operação de banco que agrupa múltiplas queries como uma unidade atômica (all-or-nothing).

### TypeScript
Superset do JavaScript com tipagem estática, usado em todo o ECMS6.

### TTL (Time To Live)
Tempo de vida de um dado em cache antes de expirar.

### Type-Safe
Garantia em tempo de compilação que operações com tipos estão corretas.

---

## U

### UUID (Universally Unique Identifier)
Identificador único padrão de 128 bits. Usamos CUID que é mais eficiente.

### Uptime
Porcentagem de tempo que o sistema está disponível e operacional.

---

## V

### Validation
Processo de verificar se dados de entrada atendem critérios esperados antes de processar.

### Variant
Variação de um produto (ex: tamanho, cor).

### Vitest
Framework de testes usado no ECMS6.

---

## W

### Webhook
Callback HTTP que notifica o sistema sobre eventos externos (ex: mensagem WhatsApp recebida).

### WebSocket
Protocolo de comunicação bidirecional em tempo real (futuro para notificações).

---

## Z

### Zod
Biblioteca de validação de schemas TypeScript-first usada no ECMS6.

---

## Siglas Comuns

| Sigla | Significado |
|-------|-------------|
| API | Application Programming Interface |
| CORS | Cross-Origin Resource Sharing |
| CPU | Central Processing Unit |
| CSS | Cascading Style Sheets |
| DB | Database |
| DNS | Domain Name System |
| DTO | Data Transfer Object |
| E2E | End-to-End |
| env | Environment |
| FK | Foreign Key |
| HTTP | Hypertext Transfer Protocol |
| HTTPS | HTTP Secure |
| ID | Identifier |
| IP | Internet Protocol |
| JWT | JSON Web Token |
| KPI | Key Performance Indicator |
| LGPD | Lei Geral de Proteção de Dados |
| MS | Milissegundos |
| N/A | Not Available |
| ORM | Object-Relational Mapping |
| PBKDF2 | Password-Based Key Derivation Function 2 |
| PK | Primary Key |
| QA | Quality Assurance |
| RAM | Random Access Memory |
| RBAC | Role-Based Access Control |
| REST | Representational State Transfer |
| SDK | Software Development Kit |
| SLA | Service Level Agreement |
| SMS | Short Message Service |
| SQL | Structured Query Language |
| SSH | Secure Shell |
| SSL | Secure Sockets Layer |
| TCP | Transmission Control Protocol |
| TLS | Transport Layer Security |
| TTL | Time To Live |
| UI | User Interface |
| URL | Uniform Resource Locator |
| UX | User Experience |
| UUID | Universally Unique Identifier |
| VIP | Very Important Person |
| VM | Virtual Machine |
| WIP | Work In Progress |
| XML | Extensible Markup Language |

---

**Última atualização:** Janeiro 2025  
**Versão:** 1.0.0
