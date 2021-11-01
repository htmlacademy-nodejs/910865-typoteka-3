'use strict';

const {nanoid} = require(`nanoid`);

const {MAX_ID_LENGTH} = require(`../../constants`);

class CommentService {
  drop(article, id) {
    return article.comments.filter((it) => it.id !== id);
  }

  create(article, {text}) {
    const newComment = {
      id: nanoid(MAX_ID_LENGTH),
      text
    };
    article.comments.push(newComment);

    return newComment;
  }

  findAll(article) {
    return article.comments;
  }
}

module.exports = CommentService;
