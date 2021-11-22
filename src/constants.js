'use strict';

const DEFAULT_COMMAND = `--help`;

const FILE_SENTENCES_PATH = `./data/sentences.txt`;

const FILE_TITLES_PATH = `./data/titles.txt`;

const FILE_CATEGORIES_PATH = `./data/categories.txt`;

const FILE_COMMENTS_PATH = `./data/comments.txt`;

const FILE_NAME = `mocks.json`;

const PUBLIC_DIR = `public`;

const TEMPLATES_DIR = `templates`;

const MAX_ELEMENT_COUNT_MESSAGE = `No more than 1000 publications`;

const NOT_FOUND_ERROR_MESSAGE = `Not found`;

const BAD_REQUEST_MESSAGE = `Bad request`;

const ARTICLE_KEYS = [`title`, `announce`, `fullText`, `createdDate`, `category`, `pictures`];

const ARTICLE_PICTURES = [`forest`, `sea`, `skyscraper`];

const FILE_EXTENSIONS = [`.jpg`, `.png`, `.webp`];

const UPLOAD_DIR = `../upload/img`;

const USER_ARGV_INDEX = 2;

const DEFAULT_COUNT = 1;

const MAX_ELEMENT_COUNT = 1000;

const API_TIMEOUT = 1000;

const DEFAULT_PORT = 8080;

const MAX_ID_LENGTH = 6;

const MAX_COMMENTS_NUMBER = 3;

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
  CREATED: 201,
  EMPTY_LIST: 204,
  BAD_REQUEST: 400,
  UNPROCESSABLE_ENTITY: 422,
};

const MockGenerationStatus = {
  success: `Operation success. File created.`,
  error: `Can't write data to file...`,
};

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`,
};

const PiecesInComment = {
  min: 1,
  max: 3
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
  TEMPLATES_DIR,
  MAX_ID_LENGTH,
  FILE_COMMENTS_PATH,
  MAX_COMMENTS_NUMBER,
  PiecesInComment,
  BAD_REQUEST_MESSAGE,
  ARTICLE_KEYS,
  Env,
  API_TIMEOUT,
  ARTICLE_PICTURES,
  FILE_EXTENSIONS,
  UPLOAD_DIR
};
