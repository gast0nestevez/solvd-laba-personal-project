import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()
const { Pool } = pg

const pool = new Pool({
  user: process.env.DB_USER,
  host: 'localhost',
  database: 'my_api',
  password: process.env.DB_PASSWORD,
  port: 5432,
})

pool.connect()
  .then(() => console.log('Connected to Postgres successfully :)'))
  .catch(err => console.error('Connection to Postgres failed: ', err))

export default pool
