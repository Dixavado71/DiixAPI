/**
 * Phone normalization utility
 * Normalizes phone numbers to a consistent format for comparison and storage
 */
/**
 * Removes all non-numeric characters from a phone number
 */
export declare function stripNonNumeric(phone: string): string;
/**
 * Normalizes a phone number to E.164-like format (without + prefix)
 * Handles Brazilian and international numbers
 *
 * Examples:
 * - "(61) 99999-9999" -> "5561999999999"
 * - "61999999999" -> "5561999999999"
 * - "+55 61 99999-9999" -> "5561999999999"
 * - "1234567890" -> "1234567890" (assumes already normalized)
 */
export declare function normalizePhone(phone: string): string;
/**
 * Validates if a phone number has a valid format
 * Does not verify if the number actually exists
 */
export declare function isValidPhone(phone: string): boolean;
/**
 * Compares two phone numbers for equality after normalization
 */
export declare function phonesAreEqual(phone1: string, phone2: string): boolean;
//# sourceMappingURL=phone.d.ts.map