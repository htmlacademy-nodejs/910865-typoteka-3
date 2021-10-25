'use strict';

const express = require(`express`);
const chalk = require(`chalk`);
const fs = require(`fs`).promises;

const {DEFAULT_PORT, FILE_NAME, HttpCode, NOT_FOUND_ERROR_MESSAGE} = require(`../../constants`);

const app = express();

app.use(express.json());
app.get(`/posts`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(FILE_NAME);
    const mocks = JSON.parse(fileContent);

    res.json(mocks);
  } catch (err) {
    res.send([]);
  }
});
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
