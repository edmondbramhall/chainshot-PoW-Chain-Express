const axios = require('axios');
const {SERVER_ROOT} = require('./config');
const Block = require('./models/Block');
const db = require('./db')
const Transaction = require("./models/Transaction");
const UTXO = require("./models/UTXO");
const https = require('https');
const { SHA256 } = require('crypto-js');
const TARGET_DIFFICULTY = BigInt("0x0000" + "F".repeat(60)); // 1:17 blocks lower than this

class Miner {
    constructor(publicKey) {
        this.publicKey = publicKey;
        const httpsAgent = new https.Agent({
            rejectUnauthorized: false,
        })
        axios.defaults.httpsAgent = httpsAgent;
    }
    mine() {

        const self = this;

        // update blockchain from server
        // PROBLEM here is that the blockchain object that comes from the
        // server isn't the full object, it doesn't have methods on.
        // console.log('updating blockchain from server');
        // axios.get(SERVER_ROOT + '/blockchain', { })
        // .then(function (response) {
        //     console.log('updated blockchain to', response.data)
        //     db.blockchain = response.data;
        // })
        // .catch(function (error) {
        //     console.log(error);
        // });    

        const previousBlock = db.blockchain.blocks[db.blockchain.blocks.length - 1];
        const previousBlockHash = SHA256(JSON.stringify(previousBlock));

        const block = new Block(this.publicKey, previousBlockHash);
        
        //TODO: add trasnsactions from the mempool
        //block.addTransaction(mempoolTransaction);
        
        while (BigInt("0x" + block.hash()) >= TARGET_DIFFICULTY) {
            block.nonce++;
        }
    
        block.execute();

        db.blockchain.addBlock(block);
    
        axios.post(SERVER_ROOT + '/submitBlock', { block: block })
        .then(function (response) {
            //console.log(response);
        })
        .catch(function (error) {
            //console.log(error);
        });    
        
        console.log(`Just mined block #${db.blockchain.blockHeight()} with a hash of ${block.hash()} at ${block.nonce}.`);
    
        setInterval(function() { self.mine() }, 5000);
    
    }    
}

module.exports = Miner;