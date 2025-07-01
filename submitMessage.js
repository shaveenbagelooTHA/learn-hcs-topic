const {
    AccountId,
    PrivateKey,
    Client,
    TopicMessageSubmitTransaction,
} = require("@hashgraph/sdk"); // v2.46.0 - Hedera SDK for blockchain interactions
require('dotenv').config()
const { hashJsonString, generateTransactionId } = require('./utils');

// Configuration =====================================================
const MY_ACCOUNT_ID = process.env.MY_ACCOUNT_ID; // Your Hedera account ID
const MY_PRIVATE_KEY = process.env.MY_PRIVATE_KEY; // Your private key
const MY_TOPIC_ID = process.env.MY_TOPIC_ID;// Existing topic ID (optional)

// Convert raw strings to SDK objects for security and type safety
const OPERATOR_ID = AccountId.fromString(MY_ACCOUNT_ID);
const OPERATOR_KEY = PrivateKey.fromStringED25519(MY_PRIVATE_KEY);

// Initialize Hedera client for Testnet with operator credentials
const client = Client.forTestnet()
    .setOperator(OPERATOR_ID, OPERATOR_KEY); // Sets transaction signing authority


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

// Main Execution Flow ==============================================
async function main() {
    console.log('\n===== Hedera Topic Demo =====\n');

    try {

        const memo = await generateTransactionId(5);
        const serialNumber = await generateTransactionId(15);
        const invoiceId = await generateTransactionId(5);

        const helloWorld = 'Hello World';

        const paymentInstruction = JSON.stringify({
            paymentInstruction: {
                payer: "ShaveenB",
                payee: "IanS",
                amount: 100,
                currency: "CHF",
                description: "Payment for Swiss chocolates",
            },
            "invoice": invoiceId,
            "memo": memo
        });
        
        const ownershipCertificate = JSON.stringify({
            "ownershipCertificate": {
                "owner": "ShaveenB",
                "device": "iPhone 16",
                "serialNumber": serialNumber
            },
            "memo": memo
        });

        const hash = await hashJsonString(ownershipCertificate);
        const ownershipCertificatePrivate = JSON.stringify({
            "ownershipCertificate": {
                "hash": hash
            },
            "memo": memo
        });

        await submitMessageToTopic(MY_TOPIC_ID, helloWorld, memo);
        await submitMessageToTopic(MY_TOPIC_ID, paymentInstruction, memo);
        await submitMessageToTopic(MY_TOPIC_ID, ownershipCertificate, memo);
        await submitMessageToTopic(MY_TOPIC_ID, ownershipCertificatePrivate, memo);

    } catch (error) {
        console.error("\n!!! Critical Error: Demo Aborted !!!", error);
    } finally {
        client.close(); // Cleanup network connections
        console.log('\n===== Demo Completed =====');
    }
}


// Execute main function
main();

