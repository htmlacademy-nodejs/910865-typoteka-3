'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const Aliase = require(`../models/aliase`);
const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);
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

const generateComments = (count, comments) => {
  return Array(count).fill({}).map(() => {
    return {
      text: shuffle(comments).slice(0, getRandomInt(PiecesInComment.min, PiecesInComment.max)).join(` `),
    };
  });
};

const generateArticles = (count, sentences, titles, categories, comments) => {
  if (count > MAX_ELEMENT_COUNT) {
    console.error(chalk.red(MAX_ELEMENT_COUNT_MESSAGE));

    process.exit(ExitCode.success);
  }

  return Array(count).fill({}).map(() => {
    const randomImageIndex = getRandomInt(0, ARTICLE_PICTURES.length - 1);
    const randomPictureName = ARTICLE_PICTURES[randomImageIndex];
    const hasPictures = Math.random() < 0.5;
    let pictures = [];
    let fullSizePictures = [];

    if (hasPictures) {
      pictures = [`${randomPictureName}@1x.jpg`, `${randomPictureName}@2x.jpg`];

      if (randomPictureName === `sea`) {
        fullSizePictures = [`sea-fullsize@1x.jpg`, `sea-fullsize@2x.jpg`];
      }
    }

    return {
      comments: generateComments(getRandomInt(1, MAX_COMMENTS_NUMBER), comments),
      title: titles[getRandomInt(0, titles.length - 1)],
      announce: shuffle(titles).slice(0, getRandomInt(1, MAX_ANNOUNCE_LENGTH)).join(` `),
      fullText: Array(MAX_SENTENCE_NUMBER).fill(``).map(() => {
        return sentences[getRandomInt(0, sentences.length - 1)];
      }).join(` `),
      pictures,
      fullSizePictures,
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

    const {Category, Article} = defineModels(sequelize);

    await sequelize.sync({force: true});

    const sentences = await readContent(FILE_SENTENCES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);

    const categoryModels = await Category.bulkCreate(
        categories.map((item) => ({name: item}))
    );

    const [count] = args;
    const noteCount = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const articles = generateArticles(noteCount, sentences, titles, categoryModels, comments);
    const articlePromises = articles.map(async (article) => {
      const articleModel = await Article.create(article, {include: [Aliase.COMMENTS]});

      await articleModel.addCategories(article.category);
    });

    await Promise.all(articlePromises);
  }
};
