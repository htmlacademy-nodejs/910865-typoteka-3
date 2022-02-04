'use strict';

const express = require(`express`);

const routes = require(`../api`);
const sequelize = require(`../lib/sequelize`);
const {getLogger} = require(`../lib/logger`);

const {DEFAULT_PORT, HttpCode, NOT_FOUND_ERROR_MESSAGE, SERVICE_UNAVAILABLE_MESSAGE, ExitCode} = require(`../../constants`);

const app = express();
const logger = getLogger({name: `api`});

app.use(express.json());
app.use(`/api`, routes);
app.use((req, res, next) => {
  logger.debug(`Request on route ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });
  next();
});
app.use((req, res) => {
  logger.error(`Route not found: ${req.url}`);
  res.status(HttpCode.NOT_FOUND)
    .send(NOT_FOUND_ERROR_MESSAGE);
});
app.use((err, _req, _res, _next) => {
  logger.error(`An error occurred on processing request: ${err.message}`);
  _res.status(HttpCode.SERVICE_UNAVAILABLE)
    .send(SERVICE_UNAVAILABLE_MESSAGE);
});

module.exports = {
  name: `--server`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(ExitCode.error);
    }
    logger.info(`Connection to database established`);

    const [port] = args;
    const userPort = Number.parseInt(port, 10) || DEFAULT_PORT;

    try {
      app.listen(userPort, (err) => {
        if (err) {
          return logger.error(`An error occurred on server creation: ${err.message}`);
        }

        return logger.info(`Listening to connections on ${userPort}`);
      });
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(ExitCode.error);
    }
  }
};
