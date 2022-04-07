const fs = require('fs');
console.log('#### NODE PG COMPARE POST INSTALL')
fs.createReadStream('.blank.env').pipe(fs.createWriteStream('.env'));

console.log(process.env)
console.log(process.env.PROJECT_CWD)