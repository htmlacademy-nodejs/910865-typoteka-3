'use strict';

const express = require(`express`);
const path = require(`path`);
const helmet = require(`helmet`);
const session = require(`express-session`);

const mainRoutes = require(`./routes/main-routes/main-routes`);
const articlesRoutes = require(`./routes/articles-routes/articles-routes`);
const commentsRoutes = require(`./routes/comments-routes/comments-routes`);
const sequelize = require(`../service/lib/sequelize`);
const {DEFAULT_PORT, PUBLIC_DIR, TEMPLATES_DIR, HttpCode, UPLOAD_DIR_NAME,
  SESSION_SECRET_IS_NOT_DEFINED_MESSAGE, SessionStore} = require(`../constants`);

const SequelizeStore = require(`connect-session-sequelize`)(session.Store);

const app = express();
const mySessionStore = new SequelizeStore({
  db: sequelize,
  expiration: SessionStore.EXPIRATION,
  checkExpirationInterval: SessionStore.CHECK_EXPIRATION_INTERVAL
});

sequelize.sync({force: false});
app.use(express.urlencoded({extended: false}));

const {SESSION_SECRET} = process.env;

if (!SESSION_SECRET) {
  throw new Error(SESSION_SECRET_IS_NOT_DEFINED_MESSAGE);
}

app.use(
    session({
      secret: SESSION_SECRET,
      store: mySessionStore,
      resave: false,
      proxy: true,
      saveUninitialized: false
    })
);
app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          scriptSrc: [`'self'`, `'unsafe-eval'`]
        }
      },
    })
);
app.use(`/`, mainRoutes);
app.use(`/articles`, articlesRoutes);
app.use(`/my`, commentsRoutes);
app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR_NAME)));
app.use((req, res) => res.status(HttpCode.NOT_FOUND).render(`errors/404`));
app.use((err, _req, res, _next) => res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`));
app.set(`views`, path.resolve(__dirname, TEMPLATES_DIR));
app.set(`view engine`, `pug`);
app.listen(DEFAULT_PORT);
