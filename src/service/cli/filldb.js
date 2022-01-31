'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const sequelize = require(`../lib/sequelize`);
const passwordUtils = require(`../lib/password`);
const initDB = require(`../lib/init-db`);
const {getLogger} = require(`../lib/logger`);
const {
  DEFAULT_COUNT, MAX_ELEMENT_COUNT,
  MAX_ELEMENT_COUNT_MESSAGE, MAX_ANNOUNCE_LENGTH,
  MAX_SENTENCE_NUMBER, ExitCode,
  FILE_CATEGORIES_PATH, FILE_TITLES_PATH, FILE_SENTENCES_PATH,
  FILE_COMMENTS_PATH, MAX_COMMENTS_NUMBER, PiecesInComment,
  ARTICLE_PICTURES
} = require(`../../constants`);
const {getRandomInt, shuffle} = require(`../../utils`);

const logger = getLogger({name: `api`});

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf-8`);

    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));

    return [];
  }
};

const generateComments = (count, comments, users) => {
  return Array(count).fill({}).map(() => {
    return {
      user: users[getRandomInt(0, users.length - 1)].email,
      text: shuffle(comments).slice(0, getRandomInt(PiecesInComment.min, PiecesInComment.max)).join(` `),
    };
  });
};

const getPictureName = () => {
  if (Math.random() < 0.5) {
    return `${ARTICLE_PICTURES[getRandomInt(0, ARTICLE_PICTURES.length - 1)]}@1x.jpg`;
  }

  return ``;
};

const generateArticles = (count, sentences, titles, categories, comments, users) => {
  if (count > MAX_ELEMENT_COUNT) {
    console.error(chalk.red(MAX_ELEMENT_COUNT_MESSAGE));

    process.exit(ExitCode.success);
  }

  return Array(count).fill({}).map(() => {
    return {
      user: users[getRandomInt(0, users.length - 1)].email,
      comments: generateComments(getRandomInt(1, MAX_COMMENTS_NUMBER), comments, users),
      title: titles[getRandomInt(0, titles.length - 1)],
      announce: shuffle(titles).slice(0, getRandomInt(1, MAX_ANNOUNCE_LENGTH)).join(` `),
      fullText: Array(MAX_SENTENCE_NUMBER).fill(``).map(() => {
        return sentences[getRandomInt(0, sentences.length - 1)];
      }).join(` `),
      picture: getPictureName(),
      category: shuffle(categories).slice(0, getRandomInt(0, categories.length - 1)),
    };
  });
};

module.exports = {
  name: `--filldb`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(ExitCode.error);
    }
    logger.info(`Connection to database established`);

    const sentences = await readContent(FILE_SENTENCES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);
    const users = [
      {
        name: `Иван`,
        surname: `Иванов`,
        email: `ivanov@example.com`,
        passwordHash: await passwordUtils.hash(`ivanov`),
        avatar: `avatar-1.png`
      },
      {
        name: `Пётр`,
        surname: `Петров`,
        email: `petrov@example.com`,
        passwordHash: await passwordUtils.hash(`petrov`),
        avatar: `avatar-2.png`
      },
      {
        name: `Олег`,
        surname: `Боталов`,
        email: `botalov@example.com`,
        passwordHash: await passwordUtils.hash(`botalov`),
        avatar: `avatar-3.png`
      },
      {
        name: `Александр`,
        surname: `Ландау`,
        email: `landau@example.com`,
        passwordHash: await passwordUtils.hash(`landau`),
        avatar: `avatar-4.png`
      },
      {
        name: `Иннокентий`,
        surname: `Смоктуновский`,
        email: `smoktunovskiy@example.com`,
        passwordHash: await passwordUtils.hash(`smoktunovskiy`),
        avatar: `avatar-5.png`
      }
    ];
    const [count] = args;
    const noteCount = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const articles = generateArticles(noteCount, sentences, titles, categories, comments, users);

    return initDB(sequelize, {categories, articles, users});
  }
};
