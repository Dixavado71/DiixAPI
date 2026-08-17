# ECMS6 - Guia Completo de Testes

## Visão Geral

O ECMS6 possui uma suíte abrangente de testes automatizados para garantir a qualidade e confiabilidade do sistema.

## Estrutura de Testes

```
tests/
├── unit/                    # Testes unitários
│   └── services/           # Testes de serviços
│       ├── admin-auth.service.test.ts
│       ├── bot-engine.service.test.ts
│       ├── webhook.service.test.ts
│       └── promotion.service.test.ts
├── integration/            # Testes de integração
│   ├── health.integration.test.ts
│   └── stores.integration.test.ts
├── e2e/                    # Testes end-to-end
│   └── checkout-flow.e2e.test.ts
├── health.test.ts          # Testes básicos de saúde
└── promotion.test.ts       # Testes de promoções
```

## Tipos de Testes

### 1. Testes Unitários

Testam unidades individuais de código (serviços, funções utilitárias) de forma isolada.

**Exemplo:**
```typescript
describe('PromotionService', () => {
  it('should calculate percentage discount correctly', async () => {
    const result = await promotionService.calculateDiscount(cart, promotion);
    expect(result.discountAmount).toBe(10);
  });
});
```

**Cobertura atual:**
- ✅ AdminAuthService (11 testes)
- ✅ BotEngineService (11 testes)
- ✅ WebhookService (11 testes)
- ✅ PromotionService (8 testes)

### 2. Testes de Integração

Testam a integração entre diferentes componentes do sistema (API, banco de dados, Redis).

**Exemplo:**
```typescript
describe('Stores API Integration', () => {
  it('should create a new store successfully', async () => {
    const response = await request(app)
      .post('/api/v1/stores')
      .send(storeData);
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});
```

**Áreas cobertas:**
- ✅ Health endpoints
- ✅ Stores CRUD
- 🔄 Customers (em desenvolvimento)
- 🔄 Products (em desenvolvimento)
- 🔄 Orders (em desenvolvimento)

### 3. Testes End-to-End (E2E)

Simulam fluxos completos do usuário, desde o início até o fim.

**Exemplo:**
```typescript
describe('Checkout Flow E2E', () => {
  it('should complete entire purchase flow', async () => {
    // 1. Create customer
    // 2. Browse catalog
    // 3. Add to cart
    // 4. Apply promotion
    // 5. Checkout
    // 6. Verify order created
  });
});
```

## Comandos Disponíveis

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch (desenvolvimento)
npm run test:watch

# Executar testes com coverage
npm run test:coverage

# Executar apenas testes unitários
npm test -- --dir tests/services

# Executar apenas testes de integração
npm test -- --dir tests/integration

# Executar testes específicos por nome
npm test -- --grep "PromotionService"
```

## Configuração do Ambiente de Teste

### Variáveis de Ambiente

Para rodar testes localmente, crie um arquivo `.env.test`:

```bash
NODE_ENV=test
DATABASE_URL=postgresql://ecms6:ecms6password@localhost:5432/ecms6_test
REDIS_URL=redis://localhost:6379
JWT_SECRET=test_secret_key_for_testing
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=test_key
EVOLUTION_WEBHOOK_SECRET=test_webhook_secret
```

### Banco de Dados de Teste

Os testes usam um banco de dados separado para não interferir com dados de desenvolvimento:

```bash
# Criar banco de teste
createdb ecms6_test

# Rodar migrations
npx prisma migrate deploy --schema prisma/schema.prisma
```

## CI/CD Pipeline

O projeto utiliza GitHub Actions para execução automática de testes:

### Gatilhos
- Push nas branches `main` e `develop`
- Pull requests para `main` e `develop`

### Jobs Executados

1. **Test**: Executa todos os testes com coverage
2. **Lint**: Verifica qualidade do código
3. **Format**: Verifica formatação
4. **Build**: Compila o TypeScript
5. **Docker Build**: Cria imagem Docker (apenas main)

### Serviços no CI
- PostgreSQL 16
- Redis 7

## Coverage Target

Meta mínima de cobertura de código: **80%**

### Por Componente
- Services: 90%
- Controllers: 85%
- Utils: 95%
- Routes: 70%

## Melhores Práticas

### 1. Nomeclatura de Testes
```typescript
// ✅ Bom
it('should return active promotions for store', () => {});
it('should throw error when promotion not found', () => {});

// ❌ Ruim
it('test promotion', () => {});
it('works correctly', () => {});
```

### 2. Estrutura AAA (Arrange, Act, Assert)
```typescript
it('should calculate discount correctly', () => {
  // Arrange
  const cart = { total: 100 };
  const promotion = { type: 'PERCENTAGE', value: 10 };
  
  // Act
  const result = service.calculateDiscount(cart, promotion);
  
  // Assert
  expect(result.discountAmount).toBe(10);
});
```

### 3. Isolamento de Testes
```typescript
// ✅ Bom - cada teste é independente
beforeEach(async () => {
  await cleanupDatabase();
});

// ❌ Ruim - testes dependem uns dos outros
it('should create item', () => {});
it('should update item created above', () => {});
```

### 4. Mocks e Stubs
```typescript
// Mock de serviço externo
const mockEvolutionClient = {
  sendMessage: vi.fn().mockResolvedValue({ success: true }),
};

// Stub de banco de dados
vi.spyOn(prisma.promotion, 'findUnique').mockResolvedValue(mockPromotion);
```

## Debugging de Testes

### VS Code Configuration

Adicione ao `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Tests",
  "skipFiles": ["<node_internals>/**"],
  "runtimeArgs": ["--inspect-brk", "node_modules/.bin/vitest", "run"],
  "console": "integratedTerminal"
}
```

### Logs em Testes
```typescript
import { beforeEach } from 'vitest';

beforeEach(() => {
  console.log('Starting test:', expect.getState().currentTestName);
});
```

## Relatórios

### Coverage Report

Após executar `npm run test:coverage`, visualize o relatório:

```bash
# Abrir relatório HTML
open coverage/index.html
```

### JUnit Report

Para integração com CI:

```bash
npm test -- --reporter=junit --outputFile=results.xml
```

## Troubleshooting

### Testes Falhando Aleatoriamente

1. Verificar se há dependência entre testes
2. Garantir isolamento com `beforeEach`
3. Checar race conditions em operações assíncronas

### Coverage Baixo

1. Identificar arquivos sem testes
2. Adicionar casos de borda
3. Testar cenários de erro

### Lentidão nos Testes

1. Parallelizar testes (`npm test -- --parallel`)
2. Mockar serviços externos
3. Usar transactions no banco de dados

## Próximos Passos

- [ ] Aumentar coverage para 85%
- [ ] Adicionar testes E2E completos
- [ ] Implementar testes de performance
- [ ] Adicionar testes de carga
- [ ] Integrar com Codecov/SonarCloud

## Links Relacionados

- [Documentação Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Prisma Testing](https://www.prisma.io/docs/guides/testing)
