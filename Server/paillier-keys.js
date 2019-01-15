const paillier = require('paillier-js')
const bigInt = require('big-integer');

const keys = paillier.generateRandomKeys(64); // Change to at least 512 bits in production state

module.exports = {
    keys
}

