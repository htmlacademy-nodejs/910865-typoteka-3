'use strict';

const DEFAULT_COMMAND = `--help`;

const FILE_SENTENCES_PATH = `./data/sentences.txt`;

const FILE_TITLES_PATH = `./data/titles.txt`;

const FILE_CATEGORIES_PATH = `./data/categories.txt`;

const FILE_COMMENTS_PATH = `./data/comments.txt`;

const FILE_NAME = `mocks.json`;

const PUBLIC_DIR = `public`;

const UPLOAD_DIR_NAME = `upload`;

const TEMPLATES_DIR = `templates`;

const MAX_ELEMENT_COUNT_MESSAGE = `No more than 1000 publications`;

const NOT_FOUND_ERROR_MESSAGE = `Not found`;

const SERVICE_UNAVAILABLE_MESSAGE = `Service unavailable`;

const ARTICLE_PICTURES = [`forest`, `sea`, `skyscraper`];

const FILE_EXTENSIONS = [`.jpg`, `.png`];

const UPLOAD_DIR = `../upload/img`;

const USER_ARGV_INDEX = 2;

const DEFAULT_COUNT = 1;

const MAX_ELEMENT_COUNT = 1000;

const API_TIMEOUT = 1000;

const DEFAULT_PORT = 8080;

const ARTICLES_PER_PAGE = 8;

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
  SERVICE_UNAVAILABLE: 503,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  CREATED: 201,
  BAD_REQUEST: 400
};

const MockGenerationStatus = {
  success: `Operation success. File created.`,
  error: `Can't write data to file...`,
};

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`,
};

const ModelName = {
  CATEGORY: `Category`,
  ARTICLE: `Article`,
  COMMENT: `Comment`,
  USER: `User`,
};

const TableName = {
  CATEGORY: `categories`,
  ARTICLE: `articles`,
  COMMENT: `comments`,
  USER: `users`,
};

const PiecesInComment = {
  min: 1,
  max: 3
};

const ErrorCommentMessage = {
  TEXT: `Сообщение содердит меньше 20 символов`,
  EMPTY: `Сообщение не может быть пустым, напишите что-нибудь!`,
  USER_ID: `Некорректный идентификатор пользователя`
};

const MIN_COMMENT_TEXT_LENGTH = 20;

const ErrorArticleMessage = {
  TITLE_MIN: `Заголовок содержит меньше 30 символов`,
  TITLE_MAX: `Заголовок не может содержать более 250 символов`,
  TITLE_REQUIRED: `Не заполнено поле "Заголовок"`,
  PICTURE: `Тип изображения не поддерживается`,
  CATEGORIES: `Не выбрана ни одна категория`,
  ANNOUNCE_MIN: `Анонс содержит меньше 30 символов`,
  ANNOUNCE_MAX: `Анонс не может содержать более 250 символов`,
  ANNOUNCE_REQUIRED: `Не заполнено поле "Анонс публикации"`,
  TEXT_MAX: `Текст не может содержать более 1000 символов`,
  DATE: `Не указана дата публикации`,
  USER_ID: `Некорректный идентификатор пользователя`
};

const ErrorRegisterMessage = {
  NAME: `Имя содержит некорректные символы`,
  NAME_REQUIRED: `Не заполнено поле "Имя"`,
  SURNAME: `Фамилия содержит некорректные символы`,
  SURNAME_REQUIRED: `Не заполнено поле "Фамилия"`,
  EMAIL: `Некорректный электронный адрес`,
  EMAIL_REQUIRED: `Не заполнено поле "Электронная почта"`,
  EMAIL_EXIST: `Электронный адрес уже используется`,
  PASSWORD: `Пароль содержит меньше 6-ти символов`,
  PASSWORD_REQUIRED: `Не заполнено поле "Пароль"`,
  PASSWORD_REPEATED: `Пароли не совпадают`,
  PASSWORD_REPEATED_REQUIRED: `Не заполнено поле "Повтор пароля"`,
  AVATAR: `Изображение не выбрано или тип изображения не поддерживается`
};

const ErrorAuthMessage = {
  EMAIL: `Электронный адрес не существует`,
  PASSWORD: `Неверный пароль`
};

const MIN_TITLE_TEXT_LENGTH = 30;

const MAX_TITLE_TEXT_LENGTH = 250;

const MIN_ANNOUNCE_TEXT_LENGTH = 30;

const MAX_ANNOUNCE_TEXT_LENGTH = 250;

const MAX_TEXT_TEXT_LENGTH = 1000;

const MIN_CATEGORIES_NUMBER = 1;

const MIN_PASSWORD_LENGTH = 6;

const HttpMethod = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`,
};

const SALT_ROUNDS = 10;

const SESSION_SECRET_IS_NOT_DEFINED_MESSAGE = `SESSION_SECRET environment variable is not defined`;

const SessionStore = {
  EXPIRATION: 180000,
  CHECK_EXPIRATION_INTERVAL: 60000
};

const ErrorCategoryMessage = {
  EMPTY: `Не указано название категории`,
  CATEGORY_NAME_MIN: `Название категории содержит меньше 5 символов`,
  CATEGORY_NAME_MAX: `Название категории содержит более 30 символов`,
  CATEGORY_EXIST: `Категория уже существует`,
  CATEGORY_ARTICLES_NOT_EMPTY: [`Категории принадлежит как минимум одна публикация`]
};

const MIN_CATEGORY_NAME_LENGTH = 5;

const MAX_CATEGORY_NAME_LENGTH = 30;

const MAX_HOT_ELEMENTS = 4;

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
  Env,
  API_TIMEOUT,
  ARTICLE_PICTURES,
  FILE_EXTENSIONS,
  UPLOAD_DIR,
  ModelName,
  TableName,
  ARTICLES_PER_PAGE,
  ErrorCommentMessage,
  MIN_COMMENT_TEXT_LENGTH,
  ErrorArticleMessage,
  MIN_TITLE_TEXT_LENGTH,
  MAX_TITLE_TEXT_LENGTH,
  MIN_ANNOUNCE_TEXT_LENGTH,
  MAX_ANNOUNCE_TEXT_LENGTH,
  MAX_TEXT_TEXT_LENGTH,
  MIN_CATEGORIES_NUMBER,
  HttpMethod,
  UPLOAD_DIR_NAME,
  SALT_ROUNDS,
  MIN_PASSWORD_LENGTH,
  ErrorRegisterMessage,
  ErrorAuthMessage,
  SESSION_SECRET_IS_NOT_DEFINED_MESSAGE,
  SessionStore,
  ErrorCategoryMessage,
  MIN_CATEGORY_NAME_LENGTH,
  MAX_CATEGORY_NAME_LENGTH,
  SERVICE_UNAVAILABLE_MESSAGE,
  MAX_HOT_ELEMENTS
};
