const fs = require('fs');
console.log('#### NODE PG COMPARE POST INSTALL')
fs.createReadStream('.blank.env').pipe(fs.createWriteStream('.env'));

let packageRawData = fs.readFileSync(`${process.INIT_CWD}/package.json`);
let packageJSON = JSON.parse(packageRawData);


if(Object.keys(packageJSON).includes('scripts')){
  packageJSON.scripts.pgc_tables = "yarn --cwd ./node_modules/node-pg-compare pgc-tables"
  packageJSON.scripts.pgc_compare = "yarn --cwd ./node_modules/node-pg-compare pgc-compare"
}else{
  packageJSON.scripts = {}
  packageJSON.scripts.pgc_tables = "yarn --cwd ./node_modules/node-pg-compare pgc-tables"
  packageJSON.scripts.pgc_compare = "yarn --cwd ./node_modules/node-pg-compare pgc-compare"
}

console.log(process.enpackageJSON)
console.log(process.enpackageJSON.toString())
fs.writeFile(`${process.INIT_CWD}/package.json`, packageJSON, 'utf8', function (err) {
  if (err) return console.log(err,process.env);
});