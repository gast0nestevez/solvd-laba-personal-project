import pool from '../utils/db.js'

export const getAll = async (tableName) => {
  try {
    const result = await pool.query(`SELECT * FROM ${tableName} ORDER BY id`)
    return result.rows
  } catch (err) {
    console.error(`Error fetching ${tableName}:`, err)
    throw new Error(`Error fetching ${tableName}`)
  }
}
