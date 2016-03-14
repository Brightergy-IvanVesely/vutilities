import Database from '../database';
import onFinished from 'on-finished';
import config from '../config';

class DatabaseLifecycle {
  singleton(app) {
    Database.connect(config.get('db:connection'), config.get('db:options'))
    .then(connection => {
      this.dbConnection = connection;
      this.onExit();

      app.set('dbConnection', connection);
      console.log('Database Connection as singleton');
    })
    .catch(() => process.exit(1));
  }

  onExit() {
    process
      .on('SIGINT', this.gracefulExit.bind(this))
      .on('SIGTERM', this.gracefulExit.bind(this));
  }

  gracefulExit() {
    if (this.dbConnection) {
      this.dbConnection
        .close()
        .then(() => {
            log.info('Mongoose connection is closed through app termination');
            process.exit(0);
        });
    }
  }

  middleware(req, res, next) {

    //creating and opening database connection at begining of request lifecycle
    if (this.database) {
      req.database = this.database;
      next();
    }
    else {
      Database.connect(req.app.get('config').db)
      .then((database) => {
        req.database = database;
        next();
      })
      .catch(next);

      //closing connection on database at the end of request lifecycle
      onFinished(req, (err, req) => {
        if (req.database) {
          req.database.close();
          req.database = null;
        }
      });
    }
  }
}

export default function(app) {
  let databaseLifecycle = new DatabaseLifecycle();
  databaseLifecycle.singleton(app);
  return databaseLifecycle.middleware.bind(databaseLifecycle);
}
