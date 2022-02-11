'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const category = require(`./category`);
const CategoryService = require(`../data-service/category`);
const {HttpCode} = require(`../../constants`);
const initDB = require(`../lib/init-db`);
const passwordUtils = require(`../lib/password`);

const mockCategories = [
  `Деревья`,
  `За жизнь`,
  `IT`,
  `Разное`
];

const mockUsers = [
  {
    name: `Иван`,
    surname: `Иванов`,
    email: `ivanov@example.com`,
    passwordHash: passwordUtils.hashSync(`ivanov`),
    avatar: `avatar-1.png`
  },
  {
    name: `Пётр`,
    surname: `Петров`,
    email: `petrov@example.com`,
    passwordHash: passwordUtils.hashSync(`petrov`),
    avatar: `avatar-2.png`
  }
];

const mockArticles = [
  {
    "userId": 1,
    "comments":[
      {
        "text":"Совсем немного...",
        "userId": 2
      },
      {
        "text":"Хочу такую же футболку :-) Плюсую, но слишком много буквы!",
        "userId": 2
      },
      {
        "text":"Мне кажется или я уже читал это где-то?",
        "userId": 2
      }
    ],
    "createdAt": "2022-01-29T14:37:21.725Z",
    "title":"Рок — это протест",
    "announce":"Борьба с прокрастинацией Самый лучший музыкальный альбом этого года Как собрать камни бесконечности",
    "fullText":"Собрать камни бесконечности легко, если вы прирожденный герой. Достичь успеха помогут ежедневные повторения. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Собрать камни бесконечности легко, если вы прирожденный герой. Программировать не настолько сложно, как об этом говорят. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Первая большая ёлка была установлена только в 1938 году. Он написал больше 30 хитов. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Из под его пера вышло 8 платиновых альбомов. Достичь успеха помогут ежедневные повторения. Из под его пера вышло 8 платиновых альбомов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Первая большая ёлка была установлена только в 1938 году. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Первая большая ёлка была установлена только в 1938 году. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Он написал больше 30 хитов. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Из под его пера вышло 8 платиновых альбомов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Простые ежедневные упражнения помогут достичь успеха. Как начать действовать? Для начала просто соберитесь. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Золотое сечение — соотношение двух величин, гармоническая пропорция. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Программировать не настолько сложно, как об этом говорят. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Простые ежедневные упражнения помогут достичь успеха. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Достичь успеха помогут ежедневные повторения. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.",
    "picture": ``,
    "category":["Разное"],
  },
  {
    "userId": 2,
    "comments":[
      {
        "text":"Это где ж такие красоты?",
        "userId": 1
      },
      {
        "text":"Плюсую, но слишком много буквы!",
        "userId": 1
      },
    ],
    "createdAt": "2022-01-29T14:37:21.725Z",
    "title":"Учим HTML и CSS",
    "announce":"Собрать камни бесконечности легко, если вы прирожденный герой.",
    "fullText":"Достичь успеха помогут ежедневные повторения. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Собрать камни бесконечности легко, если вы прирожденный герой. Программировать не настолько сложно, как об этом говорят. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Первая большая ёлка была установлена только в 1938 году. Он написал больше 30 хитов. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Из под его пера вышло 8 платиновых альбомов. Достичь успеха помогут ежедневные повторения. Из под его пера вышло 8 платиновых альбомов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Первая большая ёлка была установлена только в 1938 году. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Первая большая ёлка была установлена только в 1938 году. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Он написал больше 30 хитов. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Из под его пера вышло 8 платиновых альбомов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Простые ежедневные упражнения помогут достичь успеха. Как начать действовать? Для начала просто соберитесь. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Золотое сечение — соотношение двух величин, гармоническая пропорция. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Программировать не настолько сложно, как об этом говорят. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Простые ежедневные упражнения помогут достичь успеха. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Достичь успеха помогут ежедневные повторения. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.",
    "picture": ``,
    "category":["IT"],
  }
];

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

  await initDB(mockDB, {categories: mockCategories, articles: mockArticles, users: mockUsers});

  const app = express();

  app.use(express.json());
  category(app, new CategoryService(mockDB));

  return app;
};

let app;

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 4 categories`, () => expect(response.body.length).toBe(4));
  test(`Category names are "Деревья", "За жизнь", "IT", "Разное"`, () => {
    expect(response.body.map((it) => it.name)).toEqual(
      expect.arrayContaining(["Деревья", "За жизнь", "IT", "Разное"])
    );
  });
});

describe(`API creates category if data is valid`, () => {
  let response;
  const validCategoryData = {
    name: `TEST NAME`
  };

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/categories`)
      .send(validCategoryData);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns correct data of created category`, () => {
    expect(response.body.name).toBe(`TEST NAME`);
  });
});

describe(`API refuses to create category if data is invalid`, () => {
  let response;
  const validCategoryData = {
    not_name: `TEST NAME`
  };

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/categories`)
      .send(validCategoryData);
  });

  test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
  test(`Returns correct data of created category`, async () => {
    await request(app)
        .get(`/categories`)
        .expect((res) => expect(res.body.length).toBe(4));
  });
});

describe(`API updates category if data is valid`, () => {
  let response;
  const validCategoryData = {
    name: `TEST NAME`
  };

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .put(`/categories/1`)
      .send(validCategoryData);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns correct amout of categories`, async () => {
    await request(app)
        .get(`/categories`)
        .expect((res) => expect(res.body.length).toBe(4));
  });
  test(`Returns correct data of updated category`, async () => {
    await request(app)
        .get(`/categories`)
        .expect((res) => expect(res.body[0].name).toBe(`TEST NAME`));
  });
  test(`Category names are "TEST NAME", "За жизнь", "IT", "Разное"`, async () => {
    await request(app)
        .get(`/categories`)
        .expect((res) => expect(res.body.map((it) => it.name)).toEqual(
          expect.arrayContaining(["TEST NAME", "За жизнь", "IT", "Разное"])
        )
   );
  });
});

describe(`API refuses to update category if data is invalid`, () => {
  let response;
  const invalidCategoryData = {
    not_name: `TEST NAME`
  };

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .put(`/categories/1`)
      .send(invalidCategoryData);
  });

  test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
  test(`Returns correct amout of categories`, async () => {
    await request(app)
        .get(`/categories`)
        .expect((res) => expect(res.body.length).toBe(4));
  });
  test(`Returns correct data of category tried to update`, async () => {
    await request(app)
        .get(`/categories`)
        .expect((res) => expect(res.body[0].name).toBe(`Деревья`));
  });
  test(`Category names are "Деревья", "За жизнь", "IT", "Разное"`, async () => {
    await request(app)
        .get(`/categories`)
        .expect((res) => expect(res.body.map((it) => it.name)).toEqual(
          expect.arrayContaining(["Деревья", "За жизнь", "IT", "Разное"])
        )
   );
  });
});

describe(`API correctly deletes category`, () => {
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/categories/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns correct amout of categories`, async () => {
    await request(app)
        .get(`/categories`)
        .expect((res) => expect(res.body.length).toBe(3));
  });
  test(`Category names are "За жизнь", "IT", "Разное"`, async () => {
    await request(app)
        .get(`/categories`)
        .expect((res) => expect(res.body.map((it) => it.name)).toEqual(
          expect.arrayContaining(["За жизнь", "IT", "Разное"])
        )
   );
  });
});
