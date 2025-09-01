import pool from "../utils/db.js"

export const createEntity = async (tableName, columns, values) => {
  try {
    const cols = columns.join(", ")
    const params = values.map((_, i) => `$${i + 1}`).join(", ")
    const result = await pool.query(
      `INSERT INTO ${tableName} (${cols}) VALUES (${params}) RETURNING *`,
      values
    )
    return result.rows[0]
  } catch (err) {
    console.error(`Error inserting in ${tableName}:`, err)
    throw new Error(`Error inserting in ${tableName}`)
  }
}
