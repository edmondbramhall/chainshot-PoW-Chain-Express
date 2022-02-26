const SHA256 = require('crypto-js/sha256');
const {BLOCK_REWARD} = require('../config');
const Transaction = require("../models/Transaction");
const UTXO = require("../models/UTXO");
const MerkleTree = require("../models/MerkleTree");
const { blockchain } = require('../db');

class Block {
    blockId = null;
    constructor(minerPublicKey, prevBlockHash) {
        this.minerPublicKey = minerPublicKey;
        this.timestamp = Date.now();
        this.nonce = 0;
        this.merkleTreeRoot = null;
        this.prevBlockHash = prevBlockHash;
        this.transactions = [];
        const coinbaseUTXO = new UTXO(this.minerPublicKey, BLOCK_REWARD);
        const coinbaseTransaction = new Transaction([],[coinbaseUTXO]);
        this.addTransaction(coinbaseTransaction);    
    }
    hash() {
        const merkleTreeOfTransactions = new MerkleTree(this.transactions, function(a, b) {
            const aHash = SHA256(a).toString();
            const bHash = SHA256(b).toString();
            return SHA256(aHash + bHash).toString();
        });
        this.merkleTreeRoot = merkleTreeOfTransactions.getRoot();        
        const blockData = {
            minerPublicKey: this.minerPublicKey,
            timestamp: this.timestamp,
            nonce: this.nonce,
            prevBlockHash: this.prevBlockHash,
            difficultyTarget: this.difficultyTarget,
            merkleRootHash: this.merkleTreeRoot
        };
        return SHA256(JSON.stringify(blockData)).toString();
    }
    addTransaction(tx) {
        this.transactions.push(tx);
    }
    execute() {
        this.transactions.forEach(tx => tx.execute());
        console.log(this.merkleRootHash);
    }
}
module.exports = Block;