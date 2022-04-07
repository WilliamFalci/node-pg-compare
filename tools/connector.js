require('dotenv').config()

const {Client} = require('pg')

const Master = new Client({
  user: process.env.MASTER_DB_USER,
  password: `${process.env.MASTER_DB_PASSWORD}`,
  host: process.env.MASTER_DB_HOST,
  port: process.env.MASTER_DB_PORT,
  database: process.env.MASTER_DB_DATABASE,
})
const Slave = new Client({
  user: process.env.SLAVE_DB_USER,
  password: `${process.env.SLAVE_DB_PASSWORD}`,
  host: process.env.SLAVE_DB_HOST,
  port: process.env.SLAVE_DB_PORT,
  database: process.env.SLAVE_DB_DATABASE
})

Master.connect()
Slave.connect()

module.exports = {Master,Slave}