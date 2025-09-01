import fs from 'fs'
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()
const { Client } = pg

const client = new Client({
  user: process.env.DB_USER,
  host: 'localhost',
  database: 'my_api',
  password: process.env.DB_PASSWORD,
  port: 5432,
})

async function initDb() {
  try {
    await client.connect()
    const sql = fs.readFileSync('schema.sql', 'utf8')
    await client.query(sql)
    console.log('Database initialized successfully :)')
  } catch (err) {
    console.error('Error initializating database: ', err)
  } finally {
    await client.end()
  }
}

initDb()
