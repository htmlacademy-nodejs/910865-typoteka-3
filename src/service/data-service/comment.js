'use strict';

const {nanoid} = require(`nanoid`);

const {MAX_ID_LENGTH} = require(`../../constants`);

class CommentService {
  drop(article, commentId) {
    const dropComment = article.comments.find((item) => item.id === commentId);

    if (!dropComment) {
      return null;
    }

    article.comments = article.comments.filter((item) => item.id !== commentId);

    return dropComment;
  }

  create(article, text) {
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
