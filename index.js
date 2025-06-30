const {
    AccountId,
    PrivateKey,
    Client,
    TopicMessageSubmitTransaction,
    TopicMessageQuery,
    TopicCreateTransaction
} = require("@hashgraph/sdk"); // v2.46.0 - Hedera SDK for blockchain interactions
const crypto = require('crypto');

// Configuration =====================================================
const MY_ACCOUNT_ID = ''; // Your Hedera account ID
const MY_PRIVATE_KEY = ''; // Your private key
const MY_TOPIC_ID = ''; // Existing topic ID (optional)

// Convert raw strings to SDK objects for security and type safety
const OPERATOR_ID = AccountId.fromString(MY_ACCOUNT_ID);
const OPERATOR_KEY = PrivateKey.fromStringED25519(MY_PRIVATE_KEY);

// Initialize Hedera client for Testnet with operator credentials
const client = Client.forTestnet()
    .setOperator(OPERATOR_ID, OPERATOR_KEY); // Sets transaction signing authority

/**
 * Returns the SHA-256 hash of a JSON string.
 * @param {string} jsonString - The JSON string to hash.
 * @returns {string} The hexadecimal hash.
 */
function hashJsonString(jsonString) {
    return crypto.createHash('sha256').update(jsonString).digest('hex');
}

/**
 * Generates a random transaction ID (simulating external system reference)
 * @param {number} length - Desired ID length
 * @returns {string} Random alphanumeric ID
 * Why: Provides unique identifiers for tracking transactions
 */
function generateTransactionId(length = 5) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    return Array.from({ length }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
}

// Create a topic function ==========================================
async function createTopic() {
    console.log(`\n=== Creating New Topic ===`);

    try {
        // 1. Create transaction object
        const txCreateTopic = new TopicCreateTransaction()
            .setTopicMemo('Programmatically created topic for tutorial') // Metadata
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

// Submit a message to a topic function =============================
async function submitMessageToTopic(topicId, message, memo) {
    console.log(`\n=== Submitting Message to Topic ${topicId} ===`);
    console.log(`Message: "${message}" | Memo: "${memo}"`);

    try {
        // 1. Build message transaction
        const messageTx = new TopicMessageSubmitTransaction()
            .setTopicId(topicId) // Target topic
            .setMessage(message) // Actual message content
            .setTransactionMemo(`Ext_Id: ${memo}`) // On-chain memo            
            .freezeWith(client); // Prepare for signing

        // 2. Sign and execute transaction
        const signedTx = await messageTx.sign(OPERATOR_KEY);
        const txResponse = await signedTx.execute(client);

        // 3. Get receipt and results
        const receipt = await txResponse.getReceipt(client);
        const status = receipt.status.toString();
        const sequenceNumber = receipt.topicSequenceNumber; // Message's unique sequence
        const txId = txResponse.transactionId.toString();

        console.log("--- Message Submission Results ---");
        console.log(`Status: ${status}`);
        console.log(`Sequence Number: ${sequenceNumber}`);
        console.log(`Explorer Links:`);
        console.log(`- Topic: https://hashscan.io/testnet/topic/${topicId}`);
        console.log(`- Transaction: https://hashscan.io/testnet/tx/${txId}`);

        return sequenceNumber;

    } catch (error) {
        console.error("❌ Message Submission Failed:", error);
        throw error;
    }
}

// Topic listener function ==========================================
async function listenToTopic(topicId) {
    console.log(`\n=== Starting Listener for Topic ${topicId} ===`);

    try {
        // Create real-time subscription

        // Initialize Hedera client for Testnet with operator credentials
        const clientListener = Client.forTestnet()
            .setOperator(OPERATOR_ID, OPERATOR_KEY); // Sets transaction signing authority

        const subscription = new TopicMessageQuery()
            .setTopicId(topicId)
            .setStartTime(0) // Listen from topic creation time
            .subscribe(
                clientListener,
                (message) => { // Message handler
                    // Decode message contents from bytes
                    const content = Buffer.from(message.contents).toString();

                    console.log(`\n📬 New Message Received:`);
                    console.log(`- Sequence: ${message.sequenceNumber}`);
                    console.log(`- Timestamp: ${message.consensusTimestamp.toDate()}`);
                    console.log(`- Contents: '${content}'`);
                    console.log(`- Running Hash: ${message.runningHash.toString('hex')}`);
                },
                (error) => { // Error handler
                    console.error("🚨 Subscription Error:", error);
                }
            );

        console.log(`✅ Now listening for messages on topic ${topicId}...`);
        return subscription; // Return handle for unsubscribe control

    } catch (error) {
        console.error("❌ Listener Setup Failed:", error);
        throw error;
    }
}

// Main Execution Flow ==============================================
async function main() {
    console.log('\n===== Hedera Topic Demo =====\n');

    if (MY_ACCOUNT_ID == '' || MY_PRIVATE_KEY == '' || MY_TOPIC_ID == '') {
        console.log(' Please create a Hedera Account first.')
        throw error;
    }

    try {
        // Step 1: Create new topic or use an existing topicId
        //const topicId = await createTopic();

        // Step 2: Submit sample message
        const messageId = generateTransactionId();
        const helloWorld = 'Hello World';
        const paymentInstruction = JSON.stringify({
            paymentInstruction: {
                payer: "ShaveenB",
                payee: "IanS",
                amount: 100,
                currency: "CHF",
                description: "Payment for Swiss chocolates",
                invoice: generateTransactionId(5) // Call the function to get the invoice value
            }
        });
        const ownershipCertificate = JSON.stringify({
            "ownershipCertificate": {
                "owner": "ShaveenB",
                "device": "iPhone 16",
                "serialNumber": generateTransactionId(15)
            }
        });
        const ownershipCertificatePrivate = JSON.stringify({
            "ownershipCertificate": {
                "hash": hashJsonString(ownershipCertificate)
            }
        });

        await submitMessageToTopic(MY_TOPIC_ID, helloWorld, messageId);
        await submitMessageToTopic(MY_TOPIC_ID, paymentInstruction, messageId);
        await submitMessageToTopic(MY_TOPIC_ID, ownershipCertificate, messageId);
        await submitMessageToTopic(MY_TOPIC_ID, ownershipCertificatePrivate, messageId);

        // Step 3: Start listening for messages
        // await listenToTopic(MY_TOPIC_ID);

    } catch (error) {
        console.error("\n!!! Critical Error: Demo Aborted !!!", error);
    } finally {
        client.close(); // Cleanup network connections
        console.log('\n===== Demo Completed =====');
    }
}

// Execute main function
main();
