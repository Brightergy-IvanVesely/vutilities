import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import expressValidator from 'express-validator';
import useragent from 'express-useragent';
import favicon from 'static-favicon';

import config from '../config';
import cors from './security/cors';
//import appAuthorization from './security/appAuthorization';
import sessionStore from './session';
import databaseLifecycle from './database_lifecycle';

export default class Middlewares {
  static use(app) {
    Middlewares.basic(app);

    if (config.get('env') === 'development') {
      Middlewares.debug(app);
    }
  }

  static basic(app) {
    app.use(useragent.express());
    app.use(favicon());
    app.use(bodyParser.urlencoded({
      extended: false,
      limit: '5mb'
    }));
    app.use(bodyParser.json({
      limit: '5mb'
    }));
    app.use(cookieParser());
    app.use(expressValidator());
    app.use(cors());
    app.use(databaseLifecycle(app));
    app.use(sessionStore(app));
    app.use(compress());
    // app.use(appAuthorization());
  }

  static debug(app) {
    app.use(morgan('dev'));
    app.use((err, req, res, next) => {
      res
        .status(err.status || 500)
        .send({ message: err.message || 'unknown error' });
    });
  }
}
