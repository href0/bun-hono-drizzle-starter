export const getFormattedDate = () => {
  const date = new Date()
  return date.toISOString()
    .replace('T', ' ')
    .replace(/\.\d+Z$/, '')
}
