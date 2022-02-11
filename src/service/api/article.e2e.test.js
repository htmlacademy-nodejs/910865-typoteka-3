'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const article = require(`./article`);
const CommentService = require(`../data-service/comment`);
const ArticleService = require(`../data-service/article`);
const {HttpCode} = require(`../../constants`);
const initDb = require("../lib/init-db");
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

  await initDb(mockDB, {categories: mockCategories, articles: mockArticles, users: mockUsers});

  const app = express();

  app.use(express.json());
  article(app, new ArticleService(mockDB), new CommentService(mockDB));

  return app;
};

let app;
let response;

describe(`API returns a list of all articles`, () => {
  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 2 articles`, () => expect(response.body.length).toBe(2));
});

describe(`API returns an article with given id`, () => {
  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .get(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Article's title is "Рок — это протест"`, () => expect(response.body.title).toBe(`Рок — это протест`));
});

describe(`API returns 404 with uncorrect id`, () => {
  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .get(`/articles/1900`);
  });

  test(`API returns 404 with uncorrect id`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    "title":"test title test title test title",
    "announce":"test announce test announce test announce",
    "fullText":"test text",
    "createdAt": "2022-01-29T14:37:21.725Z",
    "categories":[4],
    "picture": "",
    "userId": 1
  };

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns correct data of created article`, () => {
    expect(response.body.id).toEqual(3);
    expect(response.body.title).toEqual(`test title test title test title`);
    expect(response.body.announce).toEqual(`test announce test announce test announce`);
    expect(response.body.fullText).toEqual(`test text`);
    expect(response.body.createdAt).toEqual(`2022-01-29T14:37:21.725Z`);
    expect(response.body.picture).toEqual(``);
    expect(response.body.userId).toEqual(1);

  });
  test(`Articles count is changed`, () => {
      request(app)
        .get(`/articles`)
        .expect((res) => expect(res.body.length).toBe(3));
  });
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    "title":"test title test title test title test title",
    "announce":"test announce test announce test announce test announce",
    "fullText":"test text",
    "category":[2,3],
    "pictures": "",
    "userId": 1
  };

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};

      delete badArticle[key];
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
  test(`Articles count didn't change`, () => {
    request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(2));
  });
});

describe(`API changes existent article`, () => {
  const newArticle = {
    "title":"test title test title test title",
    "announce":"test announce test announce test announce",
    "fullText":"test text",
    "createdAt": "2022-01-29T14:37:21.725Z",
    "categories":[4],
    "picture": "",
    "userId": 1
  };

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .put(`/articles/1`)
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns true if changed article`, () => expect(response.body).toEqual(true));
  test(`Article is really changed`, () => {
    request(app)
        .get(`/articles/1`)
        .expect((res) => expect(res.body.title).toBe(`test title`));
    }
  );
  test(`API returns status code 404 when trying to change non-existent article`, () => {
    const validArticle = {
      "title":"test title test title test title test title test title",
      "announce":"test announce test announce test announce test announce",
      "createdAt": "2022-01-29T14:37:21.725Z",
      "fullText":"test text",
      "categories":[5],
      "picture": "",
      "userId": 1
    };

    return request(app)
      .put(`/articles/178`)
      .send(validArticle)
      .expect(HttpCode.NOT_FOUND);
  });
  test(`API returns status code 400 when trying to change an article with invalid data`, () => {
    const invalidArticle = {
      "title":"test title",
      "announce":"test announce",
      "createdDate":"2021-11-6 04:37:00",
      "category":["category #1","category #2"]
    };

    return request(app)
      .put(`/articles/err`)
      .send(invalidArticle)
      .expect(HttpCode.BAD_REQUEST);
  });
});

describe(`API correctly deletes an article`, () => {
  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns deleted article`, () => expect(response.body).toBe(true));
  test(`Article count is 1 now`, () => {
    request(app)
        .get(`/articles`)
        .expect((res) => expect(res.body.length).toBe(1));
    }
  );
});

describe(`API workds correcty if trying to delete non-existent article`, () => {
  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/178`);
  });

  test(`API refuses to delete non-existent article`, () => {
    return request(app)
      .delete(`/articles/178`)
      .expect(HttpCode.NOT_FOUND);
  });

  test(`API returns correct amount of articles if non-existent article being deleted`, () => {
    request(app)
        .get(`/articles`)
        .expect((res) => expect(res.body.length).toBe(2));
  });
});

describe(`API workds correctly while trying to post a comment`, () => {
  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/articles/1/comments`)
      .send({
        text: `test article text test article text`,
        userId: 2
      });
  });

  test(`Returns status code 201`, () => {
    expect(response.statusCode).toBe(HttpCode.CREATED);
  });
  test(`Returns correct amount of comments`, () => {
    request(app)
      .get(`/articles/1/comments`)
      .expect((res) => expect(res.body.length).toBe(4));
  });
});

test(`API returns 404 while trying to post a comment to an absent article`, () => {
  return request(app)
    .post(`/articles/178/comments`)
    .send({
      text: `test article text test article text`,
      userId: 2
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API works correctly while trying to send wrong obj`, async () => {
  await request(app)
    .post(`/articles/1/comments`)
    .send({
      cat: `dog`
    });
  return expect(HttpCode.BAD_REQUEST);
});

test(`API refuses to delete non-existent comment`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/articles/1/comments/100`)
    .expect(HttpCode.NOT_FOUND);

});

describe(`API deletes comment correctly`, () => {
  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/1/comments/1`);
  });

  test(`API returns status code 200`, () => expect(response.statusCode).toEqual(HttpCode.OK));
  test(`API returns correct amount of comments`, () => {
    request(app)
      .get(`/articles/1/comments/`)
      .expect((res) => expect(res.body.length).toEqual(2));
  });
});

describe(`API works correctly while getting article's comments`, () => {
  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .get(`/articles/1/comments`);
  });

  test(`Returns correct amount of comments`, () => expect(response.body.length).toBe(3));
  test(`Returns status code 200`, () => {
    expect(response.statusCode).toBe(HttpCode.OK);
  });
});

test(`API works correctly while getting absent article's id comments`, () => {
  return request(app)
    .get(`/articles/178/comments`)
    .expect(HttpCode.NOT_FOUND);
});
