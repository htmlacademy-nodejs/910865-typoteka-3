'use strict';

const Sequelize = require(`sequelize`);

const Aliase = require(`../models/aliase`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async findAll(needCount) {
    if (needCount) {
      const result = await this._Category.findAll({
        attributes: [
          `id`,
          `name`,
          [
            Sequelize.fn(
                `COUNT`,
                `*`
            ),
            `count`
          ]
        ],
        group: [Sequelize.col(`Category.id`)],
        order: [`id`],
        include: [{
          model: this._ArticleCategory,
          as: Aliase.ARTICLE_CATEGORIES,
          attributes: []
        }]
      });

      return result.map((it) => it.get());
    } else {
      return await this._Category.findAll({raw: true});
    }
  }

  async create(categoryData) {
    const category = await this._Category.create(categoryData);

    return category.get();
  }

  async update(id, categoryData) {
    const [affectedRows] = await this._Category.update(categoryData, {
      where: {id},
    });

    return !!affectedRows;
  }

  async drop(id) {
    const deletedRows = await this._Category.destroy({
      where: {id}
    });

    return !!deletedRows;
  }

  async findByCategoryName(name) {
    const category = await this._Category.findAll({where: {name}});

    return category.map((it) => it.get());
  }
}

module.exports = CategoryService;
