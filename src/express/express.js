'use strict';

const express = require(`express`);
const path = require(`path`);

const mainRoutes = require(`./routes/main-routes/main-routes`);
const articlesRoutes = require(`./routes/articles-routes/articles-routes`);
const commentsRoutes = require(`./routes/comments-routes/comments-routes`);
const {DEFAULT_PORT, PUBLIC_DIR, TEMPLATES_DIR, HttpCode} = require(`../constants`);

const app = express();

app.use(express.urlencoded());
app.use(express.json());
app.use(`/`, mainRoutes);
app.use(`/articles`, articlesRoutes);
app.use(`/my`, commentsRoutes);
app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use((req, res) => res.status(HttpCode.NOT_FOUND).render(`errors/404`));
app.use((err, req, res) => res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`));
app.set(`views`, path.resolve(__dirname, TEMPLATES_DIR));
app.set(`view engine`, `pug`);
app.listen(DEFAULT_PORT);
