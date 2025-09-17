import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()
const { Pool } = pg

const MAX_RETRIES = 10
const RETRY_DELAY = 1000

async function createPoolWithRetry(config) {
  let retries = MAX_RETRIES

  while (retries > 0) {
    try {
      const pool = new Pool(config)
      
      await pool.query('SELECT 1')
      console.log('Connected to Postgres')
      return pool
    } catch (err) {
      retries -= 1
      console.error(`Connection to Postgres failed, retries left: ${retries}. Error: ${err.message}`)
      if (retries === 0) throw err
      await new Promise(res => setTimeout(res, RETRY_DELAY))
    }
  }
}

const pool = await createPoolWithRetry({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
})

export default pool
