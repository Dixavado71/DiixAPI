"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStateMachine = void 0;
// Define valid state transitions
const ORDER_STATE_TRANSITIONS = {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['PAYMENT_PENDING', 'PAID', 'PREPARING', 'CANCELLED'],
    PAYMENT_PENDING: ['PAID', 'PREPARING', 'CANCELLED'],
    PAID: ['PREPARING', 'READY', 'CANCELLED'],
    PREPARING: ['READY', 'CANCELLED'],
    READY: ['OUT_FOR_DELIVERY', 'CANCELLED'],
    OUT_FOR_DELIVERY: ['DELIVERED', 'CANCELLED'],
    DELIVERED: [], // Terminal state
    CANCELLED: [], // Terminal state
};
class OrderStateMachine {
    /**
     * Check if a transition from current status to new status is valid
     */
    static canTransition(current, next) {
        const allowedTransitions = ORDER_STATE_TRANSITIONS[current];
        return allowedTransitions?.includes(next) ?? false;
    }
    /**
     * Get all possible next states for a given status
     */
    static getPossibleNextStates(status) {
        return ORDER_STATE_TRANSITIONS[status] ?? [];
    }
    /**
     * Check if a status is a terminal state (cannot transition further)
     */
    static isTerminalState(status) {
        const nextStates = this.getPossibleNextStates(status);
        return nextStates.length === 0;
    }
    /**
     * Validate and execute a state transition
     * Returns the new status if valid, throws error if invalid
     */
    static transition(current, next) {
        if (!this.canTransition(current, next)) {
            throw new Error(`Invalid state transition from ${current} to ${next}. ` +
                `Allowed transitions: ${this.getPossibleNextStates(current).join(', ') || 'none'}`);
        }
        return next;
    }
    /**
     * Check if order can be cancelled
     */
    static canCancel(status) {
        return ORDER_STATE_TRANSITIONS[status]?.includes('CANCELLED') ?? false;
    }
    /**
     * Check if order is in a final state
     */
    static isFinalState(status) {
        return status === 'DELIVERED' || status === 'CANCELLED';
    }
}
exports.OrderStateMachine = OrderStateMachine;
//# sourceMappingURL=order-state-machine.js.map