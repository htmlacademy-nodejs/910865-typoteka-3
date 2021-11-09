'use strict';

const pino = require(`pino`);
const path = require(`path`);

const {Env} = require(`../../constants`);

const isDevMode = process.env.NODE_ENV === Env.DEVELOPMENT;
const defaultLogLevel = isDevMode ? `info` : `error`;

const logger = pino({
  name: `base-logger`,
  level: process.env.LOG_LEVEL || defaultLogLevel,
  prettyPrint: isDevMode,
}, isDevMode ? process.stdout : pino.destination(path.join(__dirname, `../logs/api.log`)));

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
