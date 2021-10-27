'use strict';

const express = require(`express`);
const chalk = require(`chalk`);

const mainRoutes = require(`./routes/main-routes/main-routes`);
const {DEFAULT_PORT, HttpCode, NOT_FOUND_ERROR_MESSAGE} = require(`../../constants`);

const app = express();

app.use(express.json());
app.use(`/`, mainRoutes);
app.use((req, res) => res
  .status(HttpCode.NOT_FOUND)
  .send(NOT_FOUND_ERROR_MESSAGE));

module.exports = {
  name: `--server`,
  run(args) {
    const [port] = args;
    const userPort = Number.parseInt(port, 10) || DEFAULT_PORT;

    app.listen(userPort, (err) => {
      if (err) {
        console.info(chalk.red(`Ошибка при создании сервера: ${err}`));
      } else {
        console.info(chalk.green(`Ожидаю соединений на ${userPort}`));
      }
    });
  }
};
