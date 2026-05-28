import winston from 'winston';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs-extra';

const logDir = path.join(process.cwd(), '.funcpilot', 'logs');
fs.ensureDirSync(logDir);

const customFormat = winston.format.printf(({ level, message, timestamp, ...meta }) => {
  let coloredLevel = level.toUpperCase();
  switch (level) {
    case 'info':
      coloredLevel = chalk.blue(coloredLevel);
      break;
    case 'warn':
      coloredLevel = chalk.yellow(coloredLevel);
      break;
    case 'error':
      coloredLevel = chalk.red(coloredLevel);
      break;
    case 'debug':
      coloredLevel = chalk.gray(coloredLevel);
      break;
  }
  const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
  return `${chalk.gray(timestamp)} [${coloredLevel}]: ${message} ${metaStr}`;
});

export const logger = winston.createLogger({
  level: process.env.DEBUG ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'HH:mm:ss' }),
        customFormat
      )
    }),
    new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(logDir, 'combined.log') })
  ]
});
