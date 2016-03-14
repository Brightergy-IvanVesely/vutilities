import express from 'express';
import session from 'express-session';
import ConnectMongo from 'connect-mongo';
import config from '../../config';

const MongoStore = ConnectMongo(session);
const sessionOption = {
  name: config.get('session:cookiename'),
  secret: config.get('session:key'),
  saveUninitialized: false,
  resave: false,
  cookie: {
    path: "/",
    domain: config.get('env') === 'production'
      ? config.get('session:cookiedomain')
      : null,
    httpOnly: true,
    secure: config.get('cookie:secure')
  }
};

class SessionStore {
  constructor(app) {
    this.dbConnection = app.get('dbConnection');
  }

  middleware() {
    const option = Object.assign({}, sessionOption, {
      store: new MongoStore({
        mongooseConnection: this.dbConnection
      })
    });

    return express.session(option);
  }
}

export default function sessionStore(app) {
  const ss = new SessionStore(app);
  return ss.middleware.bind(ss);
}
