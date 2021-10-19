'use strict';

const express = require(`express`);
const path = require(`path`);

const mainRoutes = require(`./routes/main-routes/main-routes`);
const articlesRoutes = require(`./routes/articles-routes/articles-routes`);
const commentsRoutes = require(`./routes/comments-routes/comments-routes`);
const {DEFAULT_PORT, PUBLIC_DIR, TEMPLATES_DIR} = require(`../constants`);

const app = express();

app.use(`/`, mainRoutes);
app.use(`/articles`, articlesRoutes);
app.use(`/my`, commentsRoutes);
app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.set(`views`, path.resolve(__dirname, TEMPLATES_DIR));
app.set(`view engine`, `pug`);
app.listen(DEFAULT_PORT);
