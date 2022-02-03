const express = require('express');
const app = express();
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const db = require('../db');
const port = 3042;

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.static('public'))
app.use(express.json());

var privateKey = fs.readFileSync('./localhost-key.pem');
var certificate = fs.readFileSync('./localhost.pem');

https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(port, () => {
    console.log(`Listening on port ${port}!`);
  });

// function exampleFunction(publicKey) {
//   return `${publicKey.substring(publicKey.len-40, 40)}`;
// }

app.get('/', (req, res) => {});

app.get('/blockchain', (req, res) => {  
  res.send(db.blockchain);
});

app.get('/miners', (req, res) => {  
    res.send(db.blockchain.getMinerStats());
  });
  
// app.get('/balance/:address', (req, res) => {  
//   const {address} = req.params;
//   const balance = balances[address] || 0;
//   res.send({ balance });
// });

app.post('/submitBlock', (req, res) => {
    console.log(req.body)
//   const errors = verifyTransaction(req.body.txData, req.body.signature, req.body.publicKey);  
//   const isValid = errors.length === 0;
//   if (isValid) {
//     processTransaction(req.body.txData);
//   }
//   res.send({ txIsValid: isValid, errors: errors, balance: balances[req.body.txData.sender] });
    db.blockchain.addBlock(req.body.block);    
    res.send(db.blockchain);
});

