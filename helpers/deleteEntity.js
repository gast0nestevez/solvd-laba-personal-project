export const deleteEntity = (collection, id) => {
  const entityId = parseInt(id)
  const index = collection.findIndex(e => e.id === entityId)
  if (index === -1) return { error: true, message: `Entity not found` }

  const deletedEntity = collection.splice(index, 1)[0]
  return { error: false, deletedEntity }
}
