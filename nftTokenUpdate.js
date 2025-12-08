const {
    AccountId,
    PrivateKey,
    Client,
    TokenUpdateNftsTransaction,
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



        const tokenId = "0.0.7398055";   // your NFT collection
        const serial = 1;                // the NFT serial to mark as PAID

        const metaPaid = {
            v: 1,
            t: "INVOICE",
            cid: "ipfs://bafy...invoice-json-cid",
            s: "PAID-up"
        };
        const metadataBytes = Buffer.from(JSON.stringify(metaPaid));

        const tx = await new TokenUpdateNftsTransaction()
            .setTokenId(tokenId)
            .setSerialNumbers([serial])     // which NFT
            .setMetadata(metadataBytes)     // new compact metadata
            .freezeWith(client)
            .sign(MY_PRIVATE_KEY);

        const res = await tx.execute(client);
        const receipt = await res.getReceipt(client);

        console.log("Update status:", receipt.status.toString());
        console.log("Tx:", res.transactionId.toString());
        console.log("HashScan:", "https://hashscan.io/testnet/transaction/" + res.transactionId.toString());

        client.close();

    } catch (error) {
        console.error(error);
    } finally {
        if (client) client.close();
    }
}

main().catch(console.error);
