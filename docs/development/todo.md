# ECMS6 - TODO e Roadmap

## ✅ Fases Concluídas

### Fase 1 - Infraestrutura Base
- [x] Node.js + TypeScript configurados
- [x] Express + Prisma ORM
- [x] PostgreSQL + Redis
- [x] Docker + Docker Compose
- [x] ESLint + Prettier
- [x] Pino (logging) + Zod (validação)
- [x] Health checks (`/api/v1/health` e `/api/v1/health/ready`)
- [x] Configuração Railway
- [x] Evolution Client inicial
- [x] Testes automatizados passando

### Fase 2 - Multi-Loja + Clientes + Autorização
- [x] Modelo `Store` com status
- [x] Modelo `StoreSettings` com configurações por loja
- [x] Modelo `Customer` com normalização de telefone
- [x] Modelo `StoreCustomer` para relacionamento multi-loja
- [x] `StoreService` completo
- [x] `CustomerService` com normalização de telefone
- [x] `StoreCustomerService` para gestão de relacionamentos
- [x] `CustomerAuthorizationService` para regras de acesso
- [x] `StoreResolverService` para identificar loja por instância Evolution
- [x] `CustomerResolverService` para resolver cliente por telefone
- [x] Validações Zod para todas as entidades
- [x] Controllers RESTful para Stores, Customers e StoreCustomers
- [x] Testes unitários e de integração
- [x] Multi-tenancy validado (lojas isoladas)
- [x] Regras de autorização testadas

### Fase 3 - Produtos + Categorias + Catálogo + Carrinho
- [x] Modelo `ProductCategory` com slug único por loja
- [x] Modelo `Product` com Decimal para preços
- [x] Modelo `ProductVariant` para variantes de produtos
- [x] Modelo `Cart` com status (ACTIVE, CHECKOUT, CONVERTED, etc.)
- [x] Modelo `CartItem` com snapshot de preço
- [x] `CategoryService` completo
- [x] `ProductService` com validação de preço e estoque
- [x] `ProductPricingService` para resolução de preços
- [x] `CatalogService` com paginação e filtros
- [x] `CartService` com validações de estoque e autorização
- [x] Catálogo público por loja
- [x] Carrinho multi-loja seguro
- [x] Preço sempre obtido do backend
- [x] Estoque opcional com validação
- [x] Testes de multi-tenancy para produtos
- [x] Testes críticos de preço e estoque

### Fase 4 - Pedidos + Checkout + Máquina de Estados
- [x] Modelo `Order` com estados bem definidos
- [x] Modelo `OrderItem` com snapshot completo
- [x] Modelo `Payment` com intenção de pagamento
- [x] Modelo `Delivery` com métodos e endereços
- [x] `OrderStateMachine` para transições de estado válidas
- [x] `OrderService` para criação e gestão de pedidos
- [x] Validação de carrinho antes de criar pedido
- [x] Reserva de estoque (com concorrência)
- [x] Snapshot de preços e promoções
- [x] Transições de estado seguras
- [x] Idempotência na criação de pedidos
- [x] API endpoints para pedidos
- [x] Documentação atualizada

## 📋 Próximas Fases

### Fase 5 - Promoções (✅ CONCLUÍDA)
- [x] Modelo `Promotion` no schema Prisma
- [x] Modelo `PromotionRule` para regras flexíveis
- [x] Modelo `PromotionProduct` para produtos em promoção
- [x] `PromotionService` para aplicação de promoções
- [x] Válidação de período de vigência
- [x] Tipos: percentual e fixo
- [x] Regras por categoria, produto, dia, quantidade
- [x] Integração com carrinho
- [x] Integração com pedidos
- [x] Testes de promoções sobrepostas
- [x] `PromotionRepository` implementado
- [x] Validators Zod para promoções
- [x] `PromotionController` RESTful
- [x] Rotas de promoção configuradas (`/stores/:storeId/promotions`)
- [x] Testes unitários passando (31 testes)
- [x] Documentação da API atualizada

### Fase 6 - Integração Evolution API Completa (PENDENTE)
- [ ] EvolutionClient com todos os métodos
- [ ] Envio de mensagens de texto
- [ ] Envio de mídia (imagens, documentos)
- [ ] Gestão de instâncias
- [ ] Webhook validation com secret
- [ ] Tratamento de erros robusto
- [ ] Retry com backoff exponencial
- [ ] Testes de integração com Evolution

### Fase 7 - Bot Engine + Conversação (PENDENTE)
- [ ] `BotEngine` determinístico
- [ ] `ConversationService` para estado da conversa
- [ ] Estados: IDLE, MENU, PRODUCT_BROWSING, etc.
- [ ] `IntentResolver` para interpretar mensagens
- [ ] Respostas automáticas para comandos comuns
- [ ] Integração com catálogo
- [ ] Integração com carrinho
- [ ] Fluxo completo de pedido via WhatsApp
- [ ] Suporte a múltiplas conversas simultâneas
- [ ] Timeout de sessão

### Fase 8 - Admin Auth + RBAC + Audit (PENDENTE)
- [ ] `AdminUser` com autenticação JWT
- [ ] Hash de senhas com bcrypt/argon2
- [ ] Roles: SUPER_ADMIN, STORE_OWNER, STORE_MANAGER, OPERATOR
- [ ] Permissões por role
- [ ] Middleware de autenticação
- [ ] Middleware de autorização
- [ ] `AuditLog` para todas as operações críticas
- [ ] Dashboard administrativo básico
- [ ] Gestão de usuários administrativos
- [ ] Testes de segurança

### Fase 9 - Testes Completos (PENDENTE)
- [ ] Testes unitários para todos os services
- [ ] Testes de integração para todos os endpoints
- [ ] Testes E2E para fluxos principais
- [ ] Testes de carga para endpoints críticos
- [ ] Coverage mínimo de 80%
- [ ] CI/CD com GitHub Actions
- [ ] Testes automatizados em cada PR

### Fase 10 - Docker + Railway Final (PENDENTE)
- [ ] Dockerfile otimizado para produção
- [ ] docker-compose.yml completo
- [ ] Scripts de deploy automatizados
- [ ] Monitoramento e alertas
- [ ] Backup automático do PostgreSQL
- [ ] Logs centralizados
- [ ] SSL/HTTPS configurado
- [ ] Domínio personalizado
- [ ] Documentação final de deploy

## 🔧 Melhorias Futuras

### IA e Automação
- [ ] AI Intent Resolver para interpretação natural
- [ ] AI Product Search para busca semântica
- [ ] AI Customer Assistant para suporte
- [ ] AI Recommendation para sugestões
- [ ] AI Support Agent para atendimento

### Analytics e Relatórios
- [ ] Dashboard de vendas
- [ ] Relatórios de performance por loja
- [ ] Métricas de conversão
- [ ] Exportação de dados (CSV, Excel)
- [ ] Gráficos e visualizações

### Integrações Externas
- [ ] Gateway de pagamento (PIX, cartão)
- [ ] Sistema de entrega (terceiros)
- [ ] ERP externo
- [ ] CRM integrado
- [ ] Email marketing

### Performance e Escala
- [ ] Cache avançado com Redis
- [ ] Filas para processamento assíncrono
- [ ] Rate limiting avançado
- [ ] CDN para imagens
- [ ] Database sharding (se necessário)

## 🐛 Bugs Conhecidos

Nenhum bug conhecido no momento.

## 📝 Notas Técnicas

### Decisões de Arquitetura
1. **Prisma ORM**: Escolhido por type-safety e facilidade de uso
2. **cuid()**: IDs globally unique e index-friendly
3. **Decimal para preços**: Precisão financeira crítica
4. **Multi-tenancy por storeId**: Isolamento lógico simples e eficaz

### Dívida Técnica
- [ ] Implementar soft delete em todas as entidades
- [ ] Adicionar versionamento de schema
- [ ] Criar seed mais completo para desenvolvimento
- [ ] Melhorar tratamento de erros internacionalização

### Melhorias de Código
- [ ] Refatorar controllers muito grandes
- [ ] Adicionar mais comentários JSDoc
- [ ] Melhorar nomes de variáveis ambíguas
- [ ] Consolidar utils duplicados

## 📊 Métricas do Projeto

- **Total de Models**: 18
- **Total de Enums**: 11
- **Endpoints Implementados**: ~45
- **Services Implementados**: ~16
- **Documentação**: 8 arquivos principais
- **Fases Concluídas**: 5 de 10 (50%)

## 🎯 Prioridades Atuais

1. **Alta**: Fase 6 - Integração Evolution (core do produto)
2. **Alta**: Fase 7 - Bot Engine (experiência do usuário)
3. **Média**: Fase 8 - Admin Auth (necessário para produção)
4. **Média**: Fase 9 - Testes (importante mas pode ser incremental)
5. **Baixa**: Fase 10 - Deploy (já funcional, precisa de polimento)
