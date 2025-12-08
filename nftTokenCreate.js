const {
    AccountId,
    PrivateKey,
    Client,
    TokenMintTransaction,
} = require("@hiero-ledger/sdk"); // v2.75.0

async function main() {
    let client;
    try {
        // Your account ID and private key from string value
        const MY_ACCOUNT_ID = AccountId.fromString("0.0.6121455");
        const MY_PRIVATE_KEY = PrivateKey.fromStringECDSA("0xf9ba6e4e6b17608e4ae562d2e00c858a2afeaa9cce5ef430d2375163be91852a");

        // Pre-configured client for testnet
        client = Client.forTestnet();

        //Set the operator with the account ID and private key
        client.setOperator(MY_ACCOUNT_ID, MY_PRIVATE_KEY);

        

        // Start your code here

        // 1) Build your metadata (keep under ~100 bytes if possible)

        const meta = {
            v: 1,                                      // version
            t: "INVOICE",                              // type
            cid: "ipfs://bafy...shortCid",             // IPFS CID of full JSON
            s: "ISSUED"                                // status
        };

        // Example: store a simple text label

        const metadataBytes = Buffer.from(JSON.stringify(meta));  // Uint8Array


        // 2) Mint ONE NFT (one element in the array = one NFT)
        const mintTx = await new TokenMintTransaction()
            .setTokenId("0.0.7398055")            // your NFT collection tokenId
            .setMetadata([metadataBytes])         // array of Uint8Array
            .freezeWith(client)
            .sign(MY_PRIVATE_KEY);                // supply key

        const mintTxResponse = await mintTx.execute(client);
        const mintReceipt = await mintTxResponse.getReceipt(client);

        console.log("Mint status     :", mintReceipt.status.toString());
        console.log("New serials     :", mintReceipt.serials.toString());
        console.log("HashScan URL    :", "https://hashscan.io/testnet/transaction/" + mintTxResponse.transactionId.toString());

        client.close();

    } catch (error) {
        console.error(error);
    } finally {
        if (client) client.close();
    }
}

main().catch(console.error);
