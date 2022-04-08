# <p align="center">NODE PG COMPARE</p>
##### <p align="center">Created with love from Italy :green_heart::white_heart::heart:</p>

## Global Requirements
- Node

## Project Tree
```plaintext
┌ node-pg-compare
├─ node-modules     (not provided - will be automatically generated running ```yarn install```)
├─ output           (not provided - will be automatically generated)
├─ tools
|  ├─ connector.js
|  ├─ console.js
|  └─ functions.js
├─ .blank.env
├─ .env             (not provided - copy blank.env and apply your configuration)
├─ .gitignore
├─ index.js
├─ LICENSE
├─ package.json
├─ README.md        (you are reading this! :heart: thanks!)
├─ table.js
└─ yarn.lock        (not provided - will be automatically generated running ```yarn install```)
```

## How to use

#### Stand-alone
- Open ```tables.js```
- Inside the object ```tables``` insert the master's table name and the slave table's name to check example ```{master: 'master_table_user', slave: 'slave_table_user'}```
- Copy ```blank.env``` name it ```.env``` and apply your connection details
- Run ```yarn pg-compare```
- Enjoy

#### Installed via npm/yarn
- After the install with ```npm install node-pg-compare --save-dev``` or ```yarn add -D node-pg-compare``` the packange.json of your project will have 3 new scripts available: ```pgc_tables```, ```pgc_compare```,  ```pgc_env```, if you use npm replace ```yarn``` with ```npm``` on ```pgc_tables``` and ```pgc_compare``` commands
- Then run ```yarn/npm pgc_env``` and set your connection details
- Then run ```yarn/npm pgc_tables```, inside the object ```tables``` insert the master's table name and the slave table's name to check example ```{master: 'master_table_user', slave: 'slave_table_user'}```
- Run ```yarn pgc-compare```
- Enjoy