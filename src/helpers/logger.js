import winston from 'winston';
import config from '../config';

const loggerConfig = config.get('winston:transports');
class Logger {
  constructor() {
    this.logger = winston.loggers.add('default', loggerConfig);
  }

  tryInitLogger() {
    if (!this.logger) {
      this.init();
    }
  }

  silly(...args) {
    this.tryInitLogger();
    return this.logger.silly.apply(this.logger, args);
  }

  debug(...args) {
    this.tryInitLogger();
    return this.logger.debug.apply(this.logger, args);
  }

  verbose(...args) {
    this.tryInitLogger();
    return this.logger.verbose.apply(this.logger, args);
  }

  info(...args) {
    this.tryInitLogger();
    return this.logger.info.apply(this.logger, args);
  }

  warn(...args) {
    this.tryInitLogger();
    return this.logger.warn.apply(this.logger, args);
  }

  error(...args) {
    this.tryInitLogger();
    return this.logger.error.apply(this.logger, args);
  }
}

const logger = new Logger();
export default logger;
