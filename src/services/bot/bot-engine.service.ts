import { PrismaClient } from '@prisma/client';
import type {
  ConversationState as ConversationStateType,
  BotMessage,
  ConversationContext,
} from '../../types/bot.types';
import type { CustomerService } from '../customer/customer.service';
import type { ProductService } from '../product/product.service';
import type { CartService } from '../cart/cart.service';
import type { OrderService } from '../order/order.service';

interface ConversationRecord {
  id: string;
  instance: string;
  phone: string;
  storeId: string | null;
  customerId: string | null;
  state: string;
  context: Record<string, unknown>;
  lastActive: Date;
}

export class BotEngineService {
  private prisma: PrismaClient;
  private customerService: CustomerService;
  private productService: ProductService;
  private cartService: CartService;
  private orderService: OrderService;

  constructor(
    prisma: PrismaClient,
    customerService: CustomerService,
    productService: ProductService,
    cartService: CartService,
    orderService: OrderService
  ) {
    this.prisma = prisma;
    this.customerService = customerService;
    this.productService = productService;
    this.cartService = cartService;
    this.orderService = orderService;
  }

  /**
   * Processa uma mensagem recebida e retorna as respostas do bot
   */
  async processMessage(
    customerId: string,
    storeId: string,
    message: string
  ): Promise<BotMessage[]> {
    const context = await this.getOrCreateContext(customerId, storeId);
    const currentState = context.state as ConversationStateType;

    let responses: BotMessage[] = [];

    switch (currentState) {
      case 'IDLE':
        responses = await this.handleIdle(context, message);
        break;
      case 'BROWSE_CATALOG':
        responses = await this.handleBrowseCatalog(context, message);
        break;
      case 'VIEW_PRODUCT':
        responses = await this.handleViewProduct(context, message);
        break;
      case 'ADD_TO_CART':
        responses = await this.handleAddToCart(context, message);
        break;
      case 'VIEW_CART':
        responses = await this.handleViewCart(context, message);
        break;
      case 'CHECKOUT':
        responses = await this.handleCheckout(context, message);
        break;
      case 'SUPPORT':
        responses = await this.handleSupport(context, message);
        break;
      case 'GOODBYE':
        responses = await this.handleGoodbye(context, message);
        break;
      default:
        responses = await this.handleIdle(context, message);
    }

    return responses;
  }

  private async getOrCreateContext(
    customerId: string,
    storeId: string
  ): Promise<ConversationContext> {
    const phone = customerId;
    const instance = 'whatsapp';

    let conversation = (await this.prisma.conversationState.findFirst({
      where: {
        instance,
        phone,
      },
    })) as ConversationRecord | null;

    if (!conversation) {
      conversation = (await this.prisma.conversationState.create({
        data: {
          instance,
          phone,
          storeId,
          customerId,
          state: 'IDLE',
          context: {},
        },
      })) as ConversationRecord;
    }

    return {
      customerId,
      storeId,
      state: conversation.state as ConversationStateType,
      metadata: conversation.context || {},
    };
  }

  private async saveContext(context: ConversationContext): Promise<void> {
    const contextData = context.metadata ? JSON.parse(JSON.stringify(context.metadata)) : {};

    await this.prisma.conversationState.updateMany({
      where: {
        instance: 'whatsapp',
        phone: context.customerId,
      },
      data: {
        state: context.state,
        context: contextData,
        lastActive: new Date(),
      },
    });
  }

  private async handleIdle(context: ConversationContext, message: string): Promise<BotMessage[]> {
    const normalizedMessage = message.toLowerCase().trim();

    if (normalizedMessage.includes('catalog') || normalizedMessage.includes('produto')) {
      return this.handleBrowseCatalog(context, message);
    }

    if (normalizedMessage.includes('ajuda') || normalizedMessage.includes('suporte')) {
      return this.handleSupport(context, message);
    }

    if (normalizedMessage.includes('tchau') || normalizedMessage.includes('adeus')) {
      return this.handleGoodbye(context, message);
    }

    return [
      {
        type: 'button',
        text: '👋 Olá! Bem-vindo à nossa loja!\n\nComo posso ajudar você hoje?',
        buttons: [
          { id: 'catalog', label: 'Ver Catálogo', payload: 'catalog' },
          { id: 'support', label: 'Ajuda', payload: 'support' },
        ],
      },
    ];
  }

  private async handleBrowseCatalog(
    context: ConversationContext,
    _message: string
  ): Promise<BotMessage[]> {
    await this.saveContext({ ...context, state: 'BROWSE_CATALOG' });

    return [
      {
        type: 'text',
        text: '🛍️ *Catálogo de Produtos*\n\nNavegue pelos nossos produtos disponíveis.',
      },
    ];
  }

  private async handleViewProduct(
    context: ConversationContext,
    _message: string
  ): Promise<BotMessage[]> {
    await this.saveContext({ ...context, state: 'VIEW_PRODUCT' });

    return [
      {
        type: 'text',
        text: '📦 *Detalhes do Produto*\n\nVeja mais informações sobre este produto.',
      },
    ];
  }

  private async handleAddToCart(
    context: ConversationContext,
    _message: string
  ): Promise<BotMessage[]> {
    await this.saveContext({ ...context, state: 'ADD_TO_CART' });

    return [
      {
        type: 'text',
        text: '🛒 *Produto Adicionado*\n\nItem adicionado ao seu carrinho com sucesso!',
      },
    ];
  }

  private async handleViewCart(
    context: ConversationContext,
    _message: string
  ): Promise<BotMessage[]> {
    await this.saveContext({ ...context, state: 'VIEW_CART' });

    return [
      {
        type: 'text',
        text: '🛒 *Seu Carrinho*\n\nVeja os itens no seu carrinho.',
      },
    ];
  }

  private async handleCheckout(
    context: ConversationContext,
    _message: string
  ): Promise<BotMessage[]> {
    await this.saveContext({ ...context, state: 'CHECKOUT' });

    return [
      {
        type: 'button',
        text: '💳 *Finalizar Compra*\n\nVamos prosseguir para o pagamento?',
        buttons: [
          { id: 'confirm_payment', label: 'Confirmar Pagamento', payload: 'confirm' },
          { id: 'cancel', label: 'Cancelar', payload: 'cancel' },
        ],
      },
    ];
  }

  private async handleSupport(
    context: ConversationContext,
    _message: string
  ): Promise<BotMessage[]> {
    await this.saveContext({ ...context, state: 'SUPPORT' });

    return [
      {
        type: 'text',
        text: '🤝 *Suporte*\n\nComo podemos ajudar você?\n\nDigite sua dúvida ou solicitação.',
      },
    ];
  }

  private async handleGoodbye(
    context: ConversationContext,
    _message: string
  ): Promise<BotMessage[]> {
    await this.saveContext({ ...context, state: 'GOODBYE' });

    return [
      {
        type: 'text',
        text: '👋 Obrigado pela visita!\n\nVolte sempre que precisar. Tenha um ótimo dia!',
      },
    ];
  }

  /**
   * Reseta o contexto da conversa para IDLE
   */
  async resetContext(customerId: string, _storeId: string): Promise<void> {
    await this.prisma.conversationState.updateMany({
      where: {
        instance: 'whatsapp',
        phone: customerId,
      },
      data: {
        state: 'IDLE',
        context: {},
        lastActive: new Date(),
      },
    });
  }

  /**
   * Marca a conversa como inativa
   */
  async endConversation(customerId: string, _storeId: string): Promise<void> {
    await this.prisma.conversationState.updateMany({
      where: {
        instance: 'whatsapp',
        phone: customerId,
      },
      data: {
        lastActive: new Date(),
      },
    });
  }
}
