import pool from "../utils/db.js"

export const deleteEntity = async (tableName, id) => {
  try {
    const result = await pool.query(
      `DELETE FROM ${tableName} WHERE id = $1 RETURNING *`,
      [id]
    )
    
    if (result.rowCount === 0) return null
    return result.rows[0]
  } catch (err) {
    console.error(`Error deleting entity from ${tableName}:`, err)
    throw new Error(`Error deleting entity from ${tableName}`)
  }
}
