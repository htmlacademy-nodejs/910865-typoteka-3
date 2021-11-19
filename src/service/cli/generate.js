'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);

const {
  FILE_NAME, DEFAULT_COUNT, MAX_ELEMENT_COUNT,
  MAX_ELEMENT_COUNT_MESSAGE, MAX_ANNOUNCE_LENGTH,
  MAX_MONTH_DEVIATION, MONTHS_IN_YEAR,
  DAYS_IN_MONTH, HOURS_IN_DAY, MINUTES_IN_HOUR,
  SECONDS_IN_MINUTE, MAX_SENTENCE_NUMBER, ExitCode,
  MockGenerationStatus, FILE_CATEGORIES_PATH,
  FILE_TITLES_PATH, FILE_SENTENCES_PATH, MAX_ID_LENGTH,
  FILE_COMMENTS_PATH, MAX_COMMENTS_NUMBER, PiecesInComment,
  ARTICLE_PICTURES
} = require(`../../constants`);
const {getRandomInt, shuffle} = require(`../../utils`);

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf-8`);

    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));

    return [];
  }
};

const generateRandomDate = () => {
  const getRandomMonth = () => {
    const currentMonth = new Date().getMonth();
    const possibleMonths = Array(MAX_MONTH_DEVIATION).fill(0).map((it, index) => {
      const possibleMonthIndex = currentMonth - index;

      it = possibleMonthIndex < 0 ? possibleMonthIndex + MONTHS_IN_YEAR : possibleMonthIndex;

      return it;
    });

    return possibleMonths[getRandomInt(0, possibleMonths.length - 1)];
  };

  const getEditedDateElement = (dateElement) => {
    return dateElement < 10 ? `0${dateElement}` : dateElement;
  };

  const currentYear = new Date().getFullYear();
  const randomMonth = getRandomMonth();
  const randomDate = getRandomInt(1, DAYS_IN_MONTH);
  const randomHour = getRandomInt(0, HOURS_IN_DAY);
  const randomMinute = getRandomInt(0, MINUTES_IN_HOUR);
  const randomSecond = getRandomInt(0, SECONDS_IN_MINUTE);
  const date = new Date(currentYear, randomMonth, randomDate, randomHour, randomMinute, randomSecond);

  return (`${currentYear}-${getEditedDateElement(date.getMonth() + 1)}-${getEditedDateElement(date.getDate())} ${getEditedDateElement(date.getHours())}:${getEditedDateElement(date.getMinutes())}:${getEditedDateElement(date.getSeconds())}`);
};

const generateComments = (count, comments) => {
  return Array(count).fill({}).map(() => {
    return {
      id: nanoid(MAX_ID_LENGTH),
      text: shuffle(comments).slice(0, getRandomInt(PiecesInComment.min, PiecesInComment.max)).join(` `),
    };
  });
};

const generateMocks = (count, sentences, titles, categories, comments) => {
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
      id: nanoid(MAX_ID_LENGTH),
      comments: generateComments(getRandomInt(1, MAX_COMMENTS_NUMBER), comments),
      title: titles[getRandomInt(0, titles.length - 1)],
      announce: shuffle(titles).slice(0, getRandomInt(1, MAX_ANNOUNCE_LENGTH)).join(` `),
      fullText: Array(MAX_SENTENCE_NUMBER).fill(``).map(() => {
        return sentences[getRandomInt(0, sentences.length - 1)];
      }).join(` `),
      pictures,
      fullSizePictures,
      createdDate: generateRandomDate(),
      category: shuffle(categories).slice(0, getRandomInt(0, categories.length - 1)),
    };
  });
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);

    const [count] = args;
    const noteCount = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const data = JSON.stringify(generateMocks(noteCount, sentences, titles, categories, comments));

    try {
      await fs.writeFile(FILE_NAME, data);
      console.info(chalk.green(MockGenerationStatus.success));
      process.exit(ExitCode.success);
    } catch (err) {
      console.error(chalk.red(MockGenerationStatus.error));
      process.exit(ExitCode.error);
    }
  }
};
