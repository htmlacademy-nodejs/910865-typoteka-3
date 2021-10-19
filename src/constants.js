const DEFAULT_COMMAND = `--help`;

const DEFAULT_PORT = 8080;

const FILE_SENTENCES_PATH = `./data/sentences.txt`;

const FILE_TITLES_PATH = `./data/titles.txt`;

const FILE_CATEGORIES_PATH = `./data/categories.txt`;

const USER_ARGV_INDEX = 2;

const FILE_NAME = `mocks.json`;

const PUBLIC_DIR = `public`;

const TEMPLATES_DIR = `templates`;

const DEFAULT_COUNT = 1;

const MAX_ELEMENT_COUNT = 1000;

const MAX_ELEMENT_COUNT_MESSAGE = `Не больше 1000 публикаций`;

const NOT_FOUND_ERROR_MESSAGE = `Не найдено`;

const MockGenerationStatus = {
  success: `Успешно`,
  error: `Неудачно`,
};

const MAX_ANNOUNCE_LENGTH = 5;

const MAX_SENTENCE_NUMBER = 40;

const MAX_MONTH_DEVIATION = 3;

const MONTHS_IN_YEAR = 12;

const DAYS_IN_MONTH = 30;

const HOURS_IN_DAY = 24;

const MINUTES_IN_HOUR = 60;

const SECONDS_IN_MINUTE = 60;

const ExitCode = {
  error: 1,
  success: 0,
};

const HttpCode = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
};

module.exports = {
  DEFAULT_COUNT,
  DEFAULT_PORT,
  FILE_SENTENCES_PATH,
  FILE_CATEGORIES_PATH,
  FILE_TITLES_PATH,
  FILE_NAME,
  USER_ARGV_INDEX,
  DEFAULT_COMMAND,
  MAX_ELEMENT_COUNT,
  MAX_ELEMENT_COUNT_MESSAGE,
  MAX_ANNOUNCE_LENGTH,
  MAX_SENTENCE_NUMBER,
  MAX_MONTH_DEVIATION,
  MONTHS_IN_YEAR,
  DAYS_IN_MONTH,
  HOURS_IN_DAY,
  MINUTES_IN_HOUR,
  SECONDS_IN_MINUTE,
  ExitCode,
  HttpCode,
  MockGenerationStatus,
  NOT_FOUND_ERROR_MESSAGE,
  PUBLIC_DIR,
  TEMPLATES_DIR
};
