const fs = require('fs');
console.log('#### NODE PG COMPARE POST INSTALL')
fs.createReadStream('.blank.env').pipe(fs.createWriteStream('.env'));

let packageRawData = fs.readFileSync(`${process.env.INIT_CWD}/package.json`);
let packageJSON = JSON.parse(packageRawData);
let command
switch(process.platform){
  case 'openbsd':
  case 'freebsd':
  case 'linux':
    command = 'xdg-open';
    break;
  case 'win32':
    command = 'start';
    break;
  case 'darwin':
    command = 'open'
    break;
}

if(Object.keys(packageJSON).includes('scripts')){
  packageJSON.scripts.pgc_tables = "yarn --cwd ./node_modules/node-pg-compare pgc-tables"
  packageJSON.scripts.pgc_compare = "yarn --cwd ./node_modules/node-pg-compare pgc-compare"
  packageJSON.scripts.pgc_env = `${command} ./node_modules/node-pg-compare/.env`
}else{
  packageJSON.scripts = {}
  packageJSON.scripts.pgc_tables = "yarn --cwd ./node_modules/node-pg-compare pgc-tables"
  packageJSON.scripts.pgc_compare = "yarn --cwd ./node_modules/node-pg-compare pgc-compare"
  packageJSON.scripts.pgc_env = `${command} ./node_modules/node-pg-compare/.env`
}

fs.writeFile(`${process.env.INIT_CWD}/package.json`, JSON.stringify(packageJSON), 'utf8', function (err) {
  if (err) return console.log(err,process.env);
});