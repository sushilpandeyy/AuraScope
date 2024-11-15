import { createLogger, format, transports } from 'winston';
import path from 'path';

const logDirectory = path.join(__dirname, 'logs');
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
  ),
  transports: [
    new transports.File({ filename: path.join(logDirectory, 'app.log') }),
    new transports.Console()
  ]
});

export default logger;
