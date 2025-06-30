# Hedera Topic Demo

This project demonstrates how to interact with the Hedera Hashgraph Consensus Service (HCS) using Node.js on Testnet. You will learn how to create a topic, submit various types of messages (including JSON payloads and hashes), and optionally listen for real-time messages on a topic.

---

## Features

- **Topic Creation:** Programmatically create a new HCS topic.
- **Message Submission:** Send plain text and JSON messages to a topic.
- **SHA-256 Hashing:** Hash JSON payloads for privacy or verification.
- **Transaction ID Generation:** Create unique IDs for tracking.
- **Topic Listener:** (Optional) Listen for and print new messages arriving on the topic.

---

## Prerequisites

- **VS Code** (VS Code IDE)[https://code.visualstudio.com/download]
- **Node.js** (v14 or higher recommended)[https://nodejs.org/en/download] 
- **npm** (Node package manager)
- **A Hedera Testnet Account**  
  Sign up for free at the [Hedera Portal](https://portal.hedera.com/register).
- **Hashpack Wallet**  
  Install the Mobile App and/or the Web Browser Addon [Hashpack Website](https://www.hashpack.app/download)

---

## Installation

1. **Clone or Download the Source Code**

   Git clone the this source code to your local

2. **Install Required Dependencies**

    npm i

3. **Start node-mon**
    
    npm run start

---

## Configuration

Edit the following variables at the top of your `index.js` file:


- **MY_ACCOUNT_ID:** Your Hedera Testnet account ID.
- **MY_PRIVATE_KEY:** Your account's private key.
- **MY_TOPIC_ID:** (Optional) If you want to use an existing topic, enter its ID. Otherwise, uncomment the `createTopic()` call in `main()` to create a new one.

---

## Usage

1. **Run the Script**


2. **What Happens**
- The script will use the topic ID you provide.  
- To create a new topic, uncomment the following line in the `main()` function:
  ```
  //const topicId = await createTopic();
  ```
- To enable the topic listener, uncomment:
  ```
  // await listenToTopic(MY_TOPIC_ID);
  ```
- The script submits several types of messages to the topic and prints transaction details and explorer links.

3. **View Results**
- Transaction and topic links are printed for easy verification on [Hashscan.IO](https://hashscan.io/testnet/home).

---

## Notes

- **Never share your private key.** Treat it like a password.
- For real-world use, secure credentials using environment variables or a secrets manager.
- Hedera Testnet is free and resets periodically—do not use for production.
- More learning resources is linked here [Hedera Documentation](https://github.com/Swiss-Digital-Assets-Institute)
- Public Github Repository is here [The Hashgraph Group AG](https://github.com/Swiss-Digital-Assets-Institute/)

---

## Troubleshooting

- **Missing credentials:** Ensure you fill in `MY_ACCOUNT_ID`, `MY_PRIVATE_KEY`, and `MY_TOPIC_ID`.
- **SDK errors:** Double-check your Hedera account details and network connectivity.
- **Node version:** If you encounter syntax errors, verify your Node.js version is up to date.

---

## License

This code is for educational purposes.

---

**Happy learning with Hedera!**
