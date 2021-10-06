'use strict';

const fs = require(`fs`);

const {
  FILE_NAME, DEFAULT_COUNT, TITLES, CATEGORIES,
  DESCRIPTIONS, MAX_ELEMENT_COUNT, MAX_ELEMENT_COUNT_MESSAGE,
  MAX_ANNOUNCE_LENGTH, MAX_MONTH_DEVIATION, MONTHS_IN_YEAR,
  DAYS_IN_MONTH, HOURS_IN_DAY, MINUTES_IN_HOUR,
  SECONDS_IN_MINUTE, MAX_SENTENCE_NUMBER, ExitCode
} = require(`../../constants`);
const { getRandomInt, shuffle } = require(`../../utils`);

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

const generateMocks = (count) => {
  if (count > MAX_ELEMENT_COUNT) {
    console.info(MAX_ELEMENT_COUNT_MESSAGE);

    process.exit(ExitCode.success);
  }

  return Array(count).fill({}).map(() => {
    return {
      title: TITLES[getRandomInt(0, TITLES.length - 1)],
      announce: shuffle(TITLES).slice(0, getRandomInt(1, MAX_ANNOUNCE_LENGTH)).join(` `),
      fullText: Array(MAX_SENTENCE_NUMBER).fill(``).map(() => {
        return DESCRIPTIONS[getRandomInt(0, DESCRIPTIONS.length - 1)];
      }).join(` `),
      createdDate: generateRandomDate(),
      category: shuffle(CATEGORIES).slice(0, getRandomInt(0, CATEGORIES.length - 1)),
    }
  })
};

module.exports = {
  name: `--generate`,
  run(args) {
    const [count] = args;
    const noteCount = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const data = JSON.stringify(generateMocks(noteCount));

    fs.writeFile(FILE_NAME, data, (err) => {
      if (err) {
        process.exit(ExitCode.error);
      }

      process.exit(ExitCode.success);
    });
  }
};
