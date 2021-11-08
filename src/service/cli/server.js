'use strict';

const express = require(`express`);

const routes = require(`../api`);
const {getLogger} = require(`../lib/logger`);

const {DEFAULT_PORT, HttpCode, NOT_FOUND_ERROR_MESSAGE, ExitCode} = require(`../../constants`);

const app = express();
const logger = getLogger({name: `api`});

app.use(express.json());
app.use(`/api`, routes);
app.use((req, res) => res
  .status(HttpCode.NOT_FOUND)
  .send(NOT_FOUND_ERROR_MESSAGE));

module.exports = {
  name: `--server`,
  run(args) {
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
      process.exit(ExitCode.error)
    }
  }
};
