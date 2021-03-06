'use strict';

const {Sequelize} = require(`sequelize`);

const Aliase = require(`../models/aliase`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Category = sequelize.models.Category;
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);

    await article.addCategories(articleData.categories);

    return article.get();
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });

    return !!deletedRows;
  }

  async findAll(needComments) {
    const options = {};
    const include = [
      Aliase.CATEGORIES,
      {
        model: this._User,
        as: Aliase.USERS,
        attributes: {
          exclude: [`passwordHash`]
        }
      }
    ];

    if (needComments) {
      options.order = [
        [{model: this._Comment, as: Aliase.COMMENTS}, `createdAt`, `DESC`]
      ];
      include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [
          {
            model: this._User,
            as: Aliase.USERS,
            attributes: {
              exclude: [`passwordHash`]
            }
          }
        ]
      });
    }

    options.include = include;

    const articles = await this._Article.findAll(options);

    return articles.map((article) => article.get());
  }

  async findMostDiscussed() {
    return await this._Article.findAll({
      attributes: {
        include: [[Sequelize.fn(`COUNT`, Sequelize.col(`comments.id`)), `count`]]
      },
      include: [{
        model: this._Comment,
        as: Aliase.COMMENTS,
        attributes: []
      }],
      group: [`Article.id`]
    });
  }

  findOne(id, needComments) {
    const include = [
      Aliase.CATEGORIES,
      {
        model: this._User,
        as: Aliase.USERS,
        attributes: {
          exclude: [`passwordHash`]
        }
      }
    ];
    const options = {};

    if (needComments) {
      options.order = [
        [{model: this._Comment, as: Aliase.COMMENTS}, `createdAt`, `DESC`]
      ];
      include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [
          {
            model: this._User,
            as: Aliase.USERS,
            attributes: {
              exclude: [`passwordHash`]
            }
          }
        ]
      });
    }

    options.include = include;

    return this._Article.findByPk(id, options);
  }

  async update(id, articleData) {
    const [affectedRows] = await this._Article.update(articleData, {
      where: {id},
    });

    return !!affectedRows;
  }

  async findPage({limit, offset, filterOption}) {
    const include = [Aliase.COMMENTS];

    if (filterOption) {
      include.push({
        model: this._Category,
        as: Aliase.CATEGORIES,
        where: {id: filterOption}
      });
    } else {
      include.push(Aliase.CATEGORIES);
    }

    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include,
      order: [
        [`createdAt`, `DESC`]
      ],
      distinct: true
    });

    return {count, articles: rows};
  }
}

module.exports = ArticleService;
