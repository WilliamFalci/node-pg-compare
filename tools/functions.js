const functions ={
  checkIfTableExist: async (connector, table_name) => {
    const value = await connector.query(`SELECT EXISTS ( SELECT FROM pg_tables WHERE tablename = '${table_name}' );`)
    return value.rows[0].exists
  },
  checkDataType: async (master_data_type, slave_data_type) => {
    if(master_data_type === slave_data_type){
      return true
    }else{
      return false
    }
  },
  checkColumnExist: async (colum_name_to_find, table_to_check) => {
    if(table_to_check.filter(x => x.column_name === colum_name_to_find).length > 0){
      return true
    }else{
      return false
    }
  },
  generateSQL: async (differences) => {
    const tables = Object.keys(differences)
    let text = ''

    for(const idx in tables){
      const table_name = tables[idx]
      if (differences[table_name].length > 0){
        text += `\n-- ${table_name}\n\n`
        for (const diffIdx in differences[table_name]){
          const curr_diff = differences[table_name][diffIdx]
          switch(curr_diff.operation){
            case 'alter_type':
              text += `ALTER TABLE ${table_name} ALTER COLUMN ${curr_diff.column} TYPE ${curr_diff.type};\n`
              break;
            case 'add_column':
              text += `ALTER TABLE ${table_name} ADD COLUMN ${curr_diff.column} ${curr_diff.type};\n`
              break;
            case 'drop_column':
              text += `ALTER TABLE ${table_name} DROP COLUMN ${curr_diff.column};\n`
              break;
          }
        }
      }
    }

    return text
  }
}

module.exports = {functions}