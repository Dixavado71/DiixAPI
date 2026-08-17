/**
 * Phone normalization utility
 * Normalizes phone numbers to a consistent format for comparison and storage
 */
/**
 * Removes all non-numeric characters from a phone number
 */
export function stripNonNumeric(phone) {
    return phone.replace(/\D/g, '');
}
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
export function normalizePhone(phone) {
    if (!phone || typeof phone !== 'string') {
        throw new Error('Phone must be a non-empty string');
    }
    // Remove all non-numeric characters
    const cleaned = stripNonNumeric(phone);
    // If empty after cleaning, throw error
    if (cleaned.length === 0) {
        throw new Error('Phone number cannot be empty');
    }
    // If starts with 55 (Brazil country code), keep as is
    if (cleaned.startsWith('55') && cleaned.length >= 12) {
        return cleaned;
    }
    // If starts with 00, remove it (international prefix)
    if (cleaned.startsWith('00')) {
        return cleaned.slice(2);
    }
    // If doesn't have country code and looks like Brazilian number (10-11 digits)
    // Add Brazil country code (55)
    if (cleaned.length >= 10 && cleaned.length <= 11) {
        return `55${cleaned}`;
    }
    // Return as is for other formats (international numbers)
    return cleaned;
}
/**
 * Validates if a phone number has a valid format
 * Does not verify if the number actually exists
 */
export function isValidPhone(phone) {
    try {
        const normalized = normalizePhone(phone);
        // Minimum reasonable length for international number
        return normalized.length >= 10;
    }
    catch {
        return false;
    }
}
/**
 * Compares two phone numbers for equality after normalization
 */
export function phonesAreEqual(phone1, phone2) {
    try {
        return normalizePhone(phone1) === normalizePhone(phone2);
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=phone.js.map