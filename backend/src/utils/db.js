/**
 * Generates SQL SET clause and values for an UPDATE statement.
 * @param {object} updates - An object with keys as column names and values as the new data.
 * @param {number} [startingParam=1] - The starting parameter index for parameterized queries (e.g., $1).
 * @returns {{setClause: string, values: Array<any>, nextParam: number}}
 */
function buildUpdateQuery(updates, startingParam = 1) {
  const fields = []
  const values = []
  let paramCount = startingParam

  Object.keys(updates).forEach((key) => {
    if (updates[key] !== undefined) {
      // Handle JSONB fields
      const value = typeof updates[key] === "object" && !Array.isArray(updates[key]) ? JSON.stringify(updates[key]) : updates[key]

      fields.push(`${key} = $${paramCount}`)
      values.push(value)
      paramCount++
    }
  })

  return {
    setClause: fields.join(", "),
    values,
    nextParam: paramCount,
  }
}

module.exports = { buildUpdateQuery }