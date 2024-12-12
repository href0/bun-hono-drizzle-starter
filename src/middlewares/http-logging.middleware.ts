import { logger } from "../config/logger.config"

export const httpLogging = (message: string, ...rest: string[]) => {
  logger.info(`${message} ${rest.length > 0 ? JSON.stringify(rest) : ""}`)
}
