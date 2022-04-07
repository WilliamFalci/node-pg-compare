const fs = require('fs');
console.log('#### NODE PG COMPARE POST INSTALL')
fs.createReadStream('.blan.env').pipe(fs.createWriteStream('.env'));