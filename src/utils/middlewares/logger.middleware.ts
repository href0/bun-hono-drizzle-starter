import { getFormattedDate } from "../helpers/date.helper"

export const customLogger = (message: string, ...rest: string[]) => {
  const timestamp = getFormattedDate()
  console.log(`${timestamp} [info]: ${message}`, ...rest)
}
