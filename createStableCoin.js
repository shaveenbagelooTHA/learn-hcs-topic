const {
    AccountId,
    PrivateKey,
    Client,
    TokenCreateTransaction,
    TokenType,
    TokenSupplyType,
} = require("@hashgraph/sdk"); // v2.46.0 - Hedera SDK for blockchain interactions
require('dotenv').config()

// Configuration =====================================================
const MY_ACCOUNT_ID = process.env.MY_ECDSA_ACCOUNT_ID; // Your ECDSA Hedera account ID
const MY_PRIVATE_KEY = process.env.MY_DER_ECDSA_PRIVATE_KEY; // Your ECDSA (DER encoded) private key

// Convert raw strings to SDK objects for security and type safety
const OPERATOR_ID = AccountId.fromString(MY_ACCOUNT_ID);
const OPERATOR_KEY = PrivateKey.fromStringECDSA(MY_PRIVATE_KEY);

// Initialize Hedera client for Testnet with operator credentials
const client = Client.forTestnet()
    .setOperator(OPERATOR_ID, OPERATOR_KEY); // Sets transaction signing authority

// Note: Stable Coin Studio normally puts these permissions behind the
// "Hedera Token Manager" smart contract it deploys for you. This script
// uses the plain Hedera Token Service (HTS) instead, so every permission
// that Stable Coin Studio listed as "Hedera Token Manager smart contract"
// or "Current user account" is granted directly to the operator key below.

// Create a stablecoin (Hedera Token Service fungible token) function =====
async function createStableCoin() {
    console.log(`\n=== Creating New Stablecoin ===`);

    try {
        // 1. Build token creation transaction using the Stable Coin Studio config
        const txCreateStableCoin = new TokenCreateTransaction()
            .setTokenName("UZH Community Loans Stablecoin ") // Stablecoin Name
            .setTokenSymbol("UZHCLS") // Stablecoin Symbol
            .setTokenType(TokenType.FungibleCommon) // Stablecoins are fungible tokens
            .setDecimals(2) // Decimals
            .setInitialSupply(10000 * 10 ** 2) // Initial supply of 10000, scaled by decimals
            .setSupplyType(TokenSupplyType.Infinite) // Supply type: Infinite (no Max supply)
            .setTreasuryAccountId(OPERATOR_ID) // Treasury Account Address (operator account)
            .setAdminKey(OPERATOR_KEY) // Admin permission -> Current user account
            .setSupplyKey(OPERATOR_KEY) // Supply permission -> enables Cash in (mint) / Burn
            .setWipeKey(OPERATOR_KEY) // Wipe permission -> Current user account
            .setFreezeKey(OPERATOR_KEY) // Freeze permission -> Current user account
            .setPauseKey(OPERATOR_KEY) // Pause permission -> Current user account
            // No KYC key set -> KYC: None
            // No custom fee schedule set -> Fee Schedule: None
            .setTokenMemo("UZH Blockchain tutorial - Community Loans Stablecoin Example") // Metadata
            .freezeWith(client); // Prepares transaction for signing

        // 2. Sign transaction with private key (Treasury/Admin/Supply/Wipe/Freeze/Pause key owner)
        const txCreateStableCoinSign = await txCreateStableCoin.sign(OPERATOR_KEY);

        // 3. Execute signed transaction on Hedera network
        const txCreateStableCoinResponse = await txCreateStableCoinSign.execute(client);

        // 4. Get transaction receipt to verify success
        const receipt = await txCreateStableCoinResponse.getReceipt(client);

        // 5. Extract results
        const status = receipt.status.toString(); // Consensus status
        const tokenId = receipt.tokenId.toString(); // New token (stablecoin) ID
        const txId = txCreateStableCoinResponse.transactionId.toString(); // Transaction ID

        console.log("--- Stablecoin Creation Results ---");
        console.log(`Status: ${status}`);
        console.log(`Token ID: ${tokenId}`);
        console.log(`Transaction ID: ${txId}`);
        console.log(`Explorer Links:`);
        console.log(`- Token: https://hashscan.io/testnet/token/${tokenId}`);
        console.log(`- Transaction: https://hashscan.io/testnet/tx/${txId}`);

        return tokenId;

    } catch (error) {
        console.error("❌ Stablecoin Creation Failed:", error);
        throw error; // Propagate error for handling upstream
    }
}

createStableCoin();
