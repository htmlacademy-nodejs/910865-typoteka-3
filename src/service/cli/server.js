'use strict';

const http = require(`http`);
const chalk = require(`chalk`);
const fs = require(`fs`).promises;

const {DEFAULT_PORT, FILE_NAME, HttpCode, NOT_FOUND_ERROR_MESSAGE} = require(`../../constants`);

const sendResponse = (res, statusCode, msg) => {
  const template = `
  <!Doctype html>
    <html lang="ru">
      <head>
        <title>Typoteka</title>
      </head>
      <body>${msg}</body>
    </html>
  `.trim();

  res.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });

  res.end(template);
};

const onClientConnect = async (req, res) => {
  switch (req.url) {
    case `/`:
      try {
        const content = await fs.readFile(FILE_NAME);
        const mocks = JSON.parse(content);
        const message = mocks.map((it) => `<li>${it.title}</li>`).join(``);

        sendResponse(res, HttpCode.OK, `<ul>${message}</ul>`);
      } catch (err) {
        sendResponse(res, HttpCode.NOT_FOUND, NOT_FOUND_ERROR_MESSAGE);
      }

      break;

    default:
      sendResponse(res, HttpCode.NOT_FOUND, NOT_FOUND_ERROR_MESSAGE);

      break;
  }
};

module.exports = {
  name: `--server`,
  run(args) {
    const [port] = args;
    const userPort = Number.parseInt(port, 10) || DEFAULT_PORT;

    http.createServer(onClientConnect)
      .listen(userPort)
      .on(`listening`, () => {
        console.info(chalk.green(`Ожидаю соединений на ${userPort}`));
      })
      .on(`error`, ({message}) => {
        console.info(chalk.red(`Ошибка при создании сервера: ${message}`));
      });
  }
};
