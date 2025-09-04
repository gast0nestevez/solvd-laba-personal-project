import fs from 'fs'
import pg from 'pg'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'

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

    // Create initial admin
    const res = await client.query(
      'SELECT id FROM admins WHERE username = $1',
      [process.env.ADMIN_USER]
    )

    if (res.rows.length === 0) {
      const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
      await client.query(
        'INSERT INTO admins (username, password_hash) VALUES ($1, $2)',
        [process.env.ADMIN_USER, hash]
      )
      console.log('Initial admin created')
    }
  } catch (err) {
    console.error('Error initializating database: ', err)
  } finally {
    await client.end()
  }
}

initDb()
