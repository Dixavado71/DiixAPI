import { OrderStatus } from '@prisma/client';
export declare class OrderStateMachine {
    /**
     * Check if a transition from current status to new status is valid
     */
    static canTransition(current: OrderStatus, next: OrderStatus): boolean;
    /**
     * Get all possible next states for a given status
     */
    static getPossibleNextStates(status: OrderStatus): OrderStatus[];
    /**
     * Check if a status is a terminal state (cannot transition further)
     */
    static isTerminalState(status: OrderStatus): boolean;
    /**
     * Validate and execute a state transition
     * Returns the new status if valid, throws error if invalid
     */
    static transition(current: OrderStatus, next: OrderStatus): OrderStatus;
    /**
     * Check if order can be cancelled
     */
    static canCancel(status: OrderStatus): boolean;
    /**
     * Check if order is in a final state
     */
    static isFinalState(status: OrderStatus): boolean;
}
//# sourceMappingURL=order-state-machine.d.ts.map