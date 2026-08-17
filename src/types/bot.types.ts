/**
 * Bot Engine Types
 * Types for conversation states, message types, and bot responses
 */

export type ConversationState = 
  | 'IDLE'
  | 'BROWSE_CATALOG'
  | 'VIEW_PRODUCT'
  | 'ADD_TO_CART'
  | 'VIEW_CART'
  | 'CHECKOUT'
  | 'PAYMENT_PENDING'
  | 'ORDER_CONFIRMED'
  | 'SUPPORT'
  | 'GOODBYE';

export type MessageType = 'text' | 'button' | 'list' | 'image' | 'quick_reply';

export interface BotMessage {
  type: MessageType;
  text: string;
  buttons?: Button[];
  image?: string;
  list?: ListItem[];
}

export interface Button {
  id: string;
  label: string;
  payload?: string;
}

export interface ListItem {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
}

export interface BotContext {
  customerId: string;
  storeId: string;
  state: ConversationState;
  lastProductId?: string;
  lastCategoryId?: string;
  metadata?: Record<string, unknown>;
}

export interface BotResponse {
  messages: BotMessage[];
  nextState: ConversationState;
  context?: Partial<BotContext>;
}
