const fs = require('fs');
console.log('#### NODE PG COMPARE POST INSTALL')
fs.createReadStream('.blank.env').pipe(fs.createWriteStream('.env'));

let packageRawData = fs.readFileSync(`${process.env.INIT_CWD}/package.json`);
let packageJSON = JSON.parse(packageRawData);


if(Object.keys(packageJSON).includes('scripts')){
  packageJSON.scripts.pgc_tables = "yarn --cwd ./node_modules/node-pg-compare pgc-tables"
  packageJSON.scripts.pgc_compare = "yarn --cwd ./node_modules/node-pg-compare pgc-compare"
  packageJSON.scripts.pgc_env = "yarn --cwd ./node_modules/node-pg-compare pgc-env"
}else{
  packageJSON.scripts = {}
  packageJSON.scripts.pgc_tables = "yarn --cwd ./node_modules/node-pg-compare pgc-tables"
  packageJSON.scripts.pgc_compare = "yarn --cwd ./node_modules/node-pg-compare pgc-compare"
  packageJSON.scripts.pgc_env = "yarn --cwd ./node_modules/node-pg-compare pgc-env"
}

fs.writeFile(`${process.env.INIT_CWD}/package.json`, JSON.stringify(packageJSON), 'utf8', function (err) {
  if (err) return console.log(err,process.env);
});