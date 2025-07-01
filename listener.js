const {
    AccountId,
    PrivateKey,
    Client,
    TopicMessageQuery
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




// Listen for messages on topic
function listenToTopic(topicId) {
    console.log(`\n=== Listening on Topic ${topicId} (Press Ctrl+C to exit) ===`);

  new TopicMessageQuery()
  .setTopicId(topicId)
  .setStartTime(new Date(Date.now() - 30000))
  .subscribe(
    client,
    (message) => {
      // Always a message (supposedly)
      const content = Buffer.from(err.contents).toString("utf8");
      console.log("\n📬 New Message Received:");
      console.log("- Sequence:", message.sequenceNumber);
      console.log("- Contents:", content);
    },
    (err) => {
      // Sometimes this gets a TopicMessage, so check type!
      if (err && err.contents) {
        const content = Buffer.from(err.contents).toString("utf8");
        console.log("\n📬 New Message Received:");
        console.log("- Sequence:", err.sequenceNumber);
        console.log("- Contents:", content);
      } else {
        // It’s a real error
        console.error("🚨 Subscription Error:", err);
      }
    }
  );

}


listenToTopic(process.env.MY_TOPIC_ID);