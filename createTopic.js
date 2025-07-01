const {
    AccountId,
    PrivateKey,
    Client,
    TopicCreateTransaction
} = require("@hashgraph/sdk"); // v2.46.0 - Hedera SDK for blockchain interactions
require('dotenv').config()
const { generateTransactionId } = require('./utils');

// Configuration =====================================================
const MY_ACCOUNT_ID = process.env.MY_ACCOUNT_ID; // Your Hedera account ID
const MY_PRIVATE_KEY = process.env.MY_PRIVATE_KEY; // Your private key

// Convert raw strings to SDK objects for security and type safety
const OPERATOR_ID = AccountId.fromString(MY_ACCOUNT_ID);
const OPERATOR_KEY = PrivateKey.fromStringED25519(MY_PRIVATE_KEY);

// Initialize Hedera client for Testnet with operator credentials
const client = Client.forTestnet()
    .setOperator(OPERATOR_ID, OPERATOR_KEY); // Sets transaction signing authority


// Create a topic function ==========================================
async function createTopic() {
    console.log(`\n=== Creating New Topic ===`);

    try {
        const messageId = await generateTransactionId(5);

        // 1. Create transaction object
        const txCreateTopic = new TopicCreateTransaction()
            .setTopicMemo(`Programmatically created topic for tutorial - ${messageId}`) // Metadata
            .freezeWith(client); // Prepares transaction for signing

        // 2. Sign transaction with private key
        const txCreateTopicSign = await txCreateTopic.sign(OPERATOR_KEY);

        // 3. Execute signed transaction on Hedera network
        const txCreateTopicResponse = await txCreateTopicSign.execute(client);

        // 4. Get transaction receipt to verify success
        const receipt = await txCreateTopicResponse.getReceipt(client);

        // 5. Extract results
        const status = receipt.status.toString(); // Consensus status
        const topicId = receipt.topicId.toString(); // New topic ID
        const txId = txCreateTopicResponse.transactionId.toString(); // Transaction ID

        console.log("--- Topic Creation Results ---");
        console.log(`Status: ${status}`);
        console.log(`Topic ID: ${topicId}`);
        console.log(`Transaction ID: ${txId}`);
        console.log(`Explorer Links:`);
        console.log(`- Topic: https://hashscan.io/testnet/topic/${topicId}`);
        console.log(`- Transaction: https://hashscan.io/testnet/tx/${txId}`);

        return topicId;

    } catch (error) {
        console.error("❌ Topic Creation Failed:", error);
        throw error; // Propagate error for handling upstream
    }
}

createTopic();