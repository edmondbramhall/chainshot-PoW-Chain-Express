const MinerProfile = require("./MinerProfile");

class Blockchain {
    constructor() {
        this.blocks = [];
    }
    addBlock(block) {
        block.blockId = this.blocks.length + 1;
        this.blocks.push(block);
    }
    blockHeight() {
        return this.blocks.length;
    }
    getMinerStats() {
        let miners = {};
        this.blocks.forEach(block => {
            if (!miners[block.minerPublicKey])
                miners[block.minerPublicKey] = new MinerProfile(block.minerPublicKey);
            miners[block.minerPublicKey].blockTotal++;
        });
        return miners;
    }
}

module.exports = Blockchain;