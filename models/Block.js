const SHA256 = require('crypto-js/sha256');
const {BLOCK_REWARD} = require('../config');
const Transaction = require("../models/Transaction");
const UTXO = require("../models/UTXO");
const MerkleTree = require("../models/MerkleTree");

class Block {
    blockId = null;
    constructor(minerPublicKey, prevBlockHash, merkleRootHash) {
        this.minerPublicKey = minerPublicKey;
        this.timestamp = Date.now();
        this.nonce = 0;
        this.prevBlockHash = prevBlockHash;
        this.merkleRootHash = merkleRootHash;
        this.transactions = [];
        const coinbaseUTXO = new UTXO(this.minerPublicKey, BLOCK_REWARD);
        const coinbaseTransaction = new Transaction([],[coinbaseUTXO]);
        this.addTransaction(coinbaseTransaction);    
    }
    hash() {
        const blockData = {
            minerPublicKey: this.minerPublicKey,
            timestamp: this.timestamp,
            nonce: this.nonce,
            prevBlockHash: this.prevBlockHash,
            difficultyTarget: this.difficultyTarget,
            merkleRootHash: this.transactions       
        };
        // for now we'll use the actual transactions instead of merkle root
        return SHA256(JSON.stringify(blockData)).toString();
    }
    addTransaction(tx) {
        this.transactions.push(tx);
    }
    execute() {
        this.transactions.forEach(tx => tx.execute());
    }
}
module.exports = Block;