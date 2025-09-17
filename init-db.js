import fs from 'fs'
import pg from 'pg'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'

dotenv.config()
const { Client } = pg

const createDatabaseIfNotExists = async () => {
  const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'postgres',
    port: process.env.DB_PORT
  })

  await client.connect()

  const res = await client.query(
    `SELECT 1 FROM pg_database WHERE datname = $1`,
    [process.env.DB_NAME]
  )

  if (res.rows.length === 0) {
    await client.query(`CREATE DATABASE ${process.env.DB_NAME}`)
    console.log(`Database ${process.env.DB_NAME} created`)
  } else {
    console.log(`Database ${process.env.DB_NAME} already exists, skipping`)
  }

  await client.end()
}

const createSchema = async () => {
  const sql = fs.readFileSync('schema.sql', 'utf8')

  const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  })

  await client.connect()
  await client.query(sql)
  await client.end()
}

const createAdmin = async () => {
  const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  })

  await client.connect()

  const res = await client.query(
    'SELECT id FROM admins WHERE username = $1',
    [process.env.ADMIN_USERNAME]
  )

  if (res.rows.length === 0) {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
    await client.query(
      'INSERT INTO admins (username, password_hash) VALUES ($1, $2)',
      [process.env.ADMIN_USERNAME, hash]
    )
    console.log('Initial admin created')
  }

  await client.end()
}

export async function initDb() {
  try {
    await createDatabaseIfNotExists()
    await createSchema()
    await createAdmin()
    console.log('Database initialized successfully :)')
  } catch (err) {
    console.error('Error initializating database: ', err)
  }
}

initDb()
