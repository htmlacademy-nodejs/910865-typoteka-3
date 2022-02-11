'use strict';

class CommentService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
  }

  async drop(id) {
    const deletedRows = this._Comment.destroy({
      where: {id}
    });

    return !!deletedRows;
  }

  async create(articleId, userId, text) {
    return this._Comment.create({
      articleId,
      userId,
      text
    });
  }

  findAll(articleId) {
    return this._Comment.findAll({
      where: {articleId},
      raw: true,
    });
  }
}

module.exports = CommentService;
