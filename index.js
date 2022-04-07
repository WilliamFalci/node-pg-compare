const fs = require('fs')
//const reader = require('readline-sync')
const {Master,Slave} = require('./tools/connector.js')
const {tables} = require('./tables.js')
const {functions} = require('./tools/functions.js')
const {text} = require('./tools/console.js')


const diff = {}

console.log(`\n\n${text.fg.Magenta}${text.style.Bold}⋗ NODE PG COMPARE ⋖${text.style.Reset}`)
console.log(`${text.fg.Magenta}${text.style.Bold}⋗ Author: Falci William Peter ⋖${text.style.Reset}\n\n`)

async function retrieveStructures(){
  for(const idx in tables){
    const master_table_name = tables[idx].master
    const slave_table_name = tables[idx].slave
    const master_structure = (await Master.query(`SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_name = '${master_table_name}'`)).rows

    const table_exist = await functions.checkIfTableExist(Slave, slave_table_name)
    if(table_exist){
      const slave_structure = (await Slave.query(`SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_name = '${slave_table_name}'`)).rows
      
      diff[slave_table_name] = []

      console.log(`${text.fg.Cyan}${text.style.Bold}┌⋗ Analysis of: ${master_table_name} <-> ${slave_table_name}: Started${text.style.Reset}`)
      await analyzeRemovals(slave_structure, master_structure)
      await analyzeDifferences(master_structure,slave_structure)
      console.log(`${text.fg.Cyan}${text.style.Bold}└⋗ Analysis of: ${master_table_name} <-> ${slave_table_name}: Finished${text.style.Reset}\n`)
    }else{
      console.log(`${text.fg.Cyan}${text.style.Bold}┌⋗ Table:${text.style.Reset} ${slave_table_name}: ${text.fg.Red}Not Exist${text.style.Reset}`)
      console.log(`${text.fg.Cyan}${text.style.Bold}└⋗ Table:${text.style.Reset} ${slave_table_name}: ${text.fg.Yellow}Will be skipped${text.style.Reset}\n`)
      // let choice
      // do {
      //   choice = reader.question(`${text.fg.Cyan}${text.style.Bold}├⋗ Table:${text.style.Reset} ${slave_table_name}: Do you want create this table using ${master_table_name}'s structure? [y/n]: `)

      //   switch(choice){
      //     case 'y':
      //       toMake[slave_table_name] = await Master.query(`SELECT generate_create_table_statement('${master_table_name}');`)
      //       console.log(toMake)

      //       console.log(`${text.fg.Cyan}${text.style.Bold}└⋗ Table:${text.style.Reset} ${slave_table_name}: ${text.fg.Yellow}Will be created using ${master_table_name}'s structure${text.style.Reset}\n`)
      //       break;
      //     case 'n':
      //       console.log(`${text.fg.Cyan}${text.style.Bold}└⋗ Table:${text.style.Reset} ${slave_table_name}: ${text.fg.Yellow}Will be skipped${text.style.Reset}\n`)
      //       break;
      //   }
      // } while (choice !== 'y' && choice !== 'n')
    }
  }
  
  
  const SQL = await functions.generateSQL(diff)
  
  if (SQL !== ''){
    if (!fs.existsSync('./output')){
      fs.mkdirSync('./output');
    }

    const file = `./output/${new Date().toLocaleString().replaceAll('/','_').replaceAll(',','_').replaceAll(' ','_')}.sql`
    fs.writeFile(file, SQL, function (err) {
      if (err) throw err;
      console.log(`\n${text.fg.Magenta}${text.style.Bold}⋗ File is created successfully${text.style.Reset}`);
      console.log(`${text.fg.Magenta}${text.style.Bold}⋗ SQL File: ${text.fg.Green}${file}${text.style.Reset}\n\n`)
      process.exit()
    });
  }else{
    process.exit()
  }
}

async function analyzeDifferences(master_table, slave_table){
  for(const idx in master_table){
    const master_column = master_table[idx]
    const exist = await functions.checkColumnExist(master_column.column_name,slave_table)
    switch (exist){
      case true:
        const slave_column = slave_table.filter(x => x.column_name === master_column.column_name)[0]
        const checkDataType = await functions.checkDataType(master_column.data_type, slave_column.data_type)
        if (checkDataType) {
          console.log(`${text.fg.Cyan}${text.style.Bold}├⋗ Column:${text.style.Reset} ${master_column.column_name}: ${text.fg.Green}is equal${text.style.Reset}`)
        }else{
          diff[slave_column.table_name].push({column: slave_column.column_name, operation: 'alter_type', type: master_column.data_type})
          console.log(`${text.fg.Cyan}${text.style.Bold}├⋗ Column:${text.style.Reset} ${master_column.column_name}: ${text.fg.Yellow}is different${text.style.Reset}`)
        }
        break;
      case false:
        diff[slave_column.table_name].push({column: slave_column.column_name, operation: 'add_column', type: master_column.data_type})
        console.log(`${text.fg.Cyan}${text.style.Bold}├⋗ Column:${text.style.Reset} ${master_column.column_name}: ${text.fg.Yellow}must be created${text.style.Reset}`)
        break;
    }
  }
}

async function analyzeRemovals(slave_table, master_table){
  for (const idx in slave_table){
    const slave_column = slave_table[idx]
    const exist = await functions.checkColumnExist(slave_column.column_name,master_table)
    if(!exist){
      diff[slave_column.table_name].push({column: slave_column.column_name, operation: 'drop_column'})
      console.log(`${text.fg.Cyan}${text.style.Bold}├⋗ Column:${text.style.Reset} ${master_column.column_name}: ${text.fg.Red}$must be deleted${text.style.Reset}`)
    }
  }
}

retrieveStructures()