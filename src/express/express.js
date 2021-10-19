'use strict';

const express = require(`express`);

const mainRoutes = require(`./routes/main-routes/main-routes`);
const articlesRoutes = require(`./routes/articles-routes/articles-routes`);
const commentsRoutes = require(`./routes/comments-routes/comments-routes`);
const {DEFAULT_PORT} = require(`../constants`);

const app = express();

app.use(`/`, mainRoutes);
app.use(`/articles`, articlesRoutes);
app.use(`/my`, commentsRoutes);
app.listen(DEFAULT_PORT);
