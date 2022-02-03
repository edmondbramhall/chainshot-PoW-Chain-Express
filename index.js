const EC = require('elliptic').ec;

const ec = new EC('secp256k1');
const key = ec.genKeyPair();
const Miner = require('./miner');
const privateKey = key.getPrivate().toString(16);
const publicKey = key.getPublic().encode("hex");
console.log("Starting miner.");
console.log(`Public key: ${publicKey}`);
console.log(`Private key: ${privateKey}`);

const miner = new Miner(publicKey);
miner.mine();

    //const {utxos} = require("./db");
    // getBalance: function([address], callback) {
    //     const relevantUtxos = utxos.filter(x => {
    //         return x.owner === address && !x.spent;
    //     });
    //     const sum = relevantUtxos.reduce((p, c) => p + c.amount, 0);
    //     callback(null, sum);
    // }

