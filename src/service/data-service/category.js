'use strict';

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
    this._sequelize = sequelize;
  }

  async findAll(needCount) {
    if (needCount) {
      const result = await this._sequelize.query(`SELECT "Category"."id", "Category"."name",
      COUNT('*') AS "count" FROM "ArticleCategories" AS "articleCategories"
      LEFT OUTER JOIN "categories" AS "Category" ON "articleCategories"."CategoryId" = "Category"."id"
      GROUP BY "Category"."id" ORDER BY "Category"."id";`);

      return result[1].rows;
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
    const categoryIdArticles = await this._ArticleCategory.findAll({where: {CategoryId: id}});

    let deletedRows;

    if (categoryIdArticles.length === 0) {
      deletedRows = await this._Category.destroy({
        where: {id}
      });
    } else {
      deletedRows = null;
    }

    return !!deletedRows;
  }

  async findByCategoryName(name) {
    const category = await this._Category.findAll({where: {name}});

    return category.map((it) => it.get());
  }
}

module.exports = CategoryService;
