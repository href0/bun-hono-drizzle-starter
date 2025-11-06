// src/lib/logger.ts
import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf } = format;
import 'winston-daily-rotate-file'
import { NodeEnv } from '../utils/interfaces/env.interface';

// Format log custom
const logFormat = printf(({ level, message, timestamp, sql, params, duration, errors, stack }) => {
  let log = `${timestamp} [${level}]: ${message}`;
  if (sql) log += `\nQUERY: ${typeof sql === 'string' ? sql : JSON.stringify(sql)} `;
  if (params) log += `\nPARAMS: ${JSON.stringify(params)}`;
  if (errors) log += `\nMESSAGE: ${typeof errors === 'string' ? errors : JSON.stringify(errors)}`;
  if (stack) log += `\nSTACK: ${typeof stack === 'string' ? stack : JSON.stringify(stack)}`;
  if (duration) log += `\nDURATION: ${typeof duration === 'string' ? duration : JSON.stringify(duration)}ms`;
 
  return log;
});

export const logger = createLogger({
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    // new transports.File({
    //   filename: 'logs/info.log',
    //   maxsize: 5242880, // 5MB
    //   maxFiles: 5,
    // }),
    new transports.DailyRotateFile({
      filename: 'logs/info-%DATE%.log',
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
      format:  combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
      )
    }),
    // new transports.File({ filename: 'logs/error.log', level: 'error' }),
    // new transports.File({ filename: 'logs/combined.log' }),
    // new tr
  ]
});

// if (Bun.env.NODE_ENV !== NodeEnv.PROD) {
//   logger.add(new transports.Console());
// }