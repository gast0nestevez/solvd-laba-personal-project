export const createEntity = (collection, data) => {
  const newEntity = {
    id: collection.length + 1,
    ...data
  }
  collection.push(newEntity)
  return newEntity
}
