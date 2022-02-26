class MerkleTree {
    constructor(leaves, concat) {
        this.leaves = leaves;
        this.concat = concat;
    }
    getProof(index, currentLevel = this.leaves, proof = []) {
        if (currentLevel.length === 1)
            return proof;
        let newLevel = [];
        for (let i = 0; i < currentLevel.length; i += 2) {
            if (currentLevel[i] === index)
                proof.push({ data: i, left: true });
            else if (currentLevel[i+1] === index)
                proof.push({ data: i+1, left: false });
        }
        return this.getProof(index, newLevel, proof);
    }
    getRoot(currentLevel) {
        currentLevel = currentLevel || this.leaves;
        console.log(currentLevel);
        let newLevel = [];
        if (currentLevel.length === 1)
            return this.concat(currentLevel[0]);
        for (let i = 0; i < currentLevel.length; i += 2) {
            if (currentLevel[i + 1] != null) {
                newLevel.push(this.concat(currentLevel[i], currentLevel[i + 1]));
            } else {
                newLevel.push(this.concat(currentLevel[i]));
            }
        }
        return this.getRoot(newLevel);
    }
}

module.exports = MerkleTree;