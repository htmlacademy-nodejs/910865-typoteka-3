'use strict';

const pino = require(`pino`);

const {Env} = require(`../../constants`);

const isDevMode = process.env.NODE_ENV === Env.DEVELOPMENT;
const defaultLogLevel = isDevMode ? `info` : `error`;

const logger = pino({
  name: `base-logger`,
  level: process.env.LOG_LEVEL || defaultLogLevel,
  prettyPrint: isDevMode,
}, isDevMode ? process.stdout : pino.destination(`${__dirname}/../logs/api.log`)); // Error: ENOENT: no such file or directory, open './logs/api.log'

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
