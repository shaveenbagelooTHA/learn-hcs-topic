// utils.js

const crypto = require('crypto');

/**
 * Returns the SHA-256 hash of a JSON string.
 * @param {string} jsonString - The JSON string to hash.
 * @returns {string} The hexadecimal hash.
 */
async function hashJsonString(jsonString) {
    return crypto.createHash('sha256').update(jsonString).digest('hex');
}

/**
 * Generates a random transaction ID (simulating external system reference)
 * @param {number} length - Desired ID length
 * @returns {string} Random alphanumeric ID
 * Why: Provides unique identifiers for tracking transactions
 */
async function generateTransactionId(length = 5) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    return Array.from({ length }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
}

// Export the functions for use in other files
module.exports = {
    hashJsonString,
    generateTransactionId
};

/*
  ---- Usage Example in another file (Node.js) ----
  const { hashJsonString, generateTransactionId } = require('./utils');

  const hash = hashJsonString(JSON.stringify({ foo: 'bar' }));
  const txnId = generateTransactionId(8);
  console.log(hash, txnId);
*/

/*
  ---- For ES Modules (if using "type": "module" in package.json) ----
  // Replace `require` and `module.exports` with:
  import crypto from 'crypto';
  export function hashJsonString(...) { ... }
  export function generateTransactionId(...) { ... }
*/
