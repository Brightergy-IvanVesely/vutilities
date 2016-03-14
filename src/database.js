import mongoose from 'mongoose';
import log from './helpers/logger';

Promise.promisifyAll(mongoose);

export default class Database {

  static connect(connectionUrl, option) {
    let database = new Database();

    return mongoose.connectAsync(connectionUrl, option)
    .then(() => {
      log.info('Mongoose connected');
      return database.connection = mongoose.connection;
    })
    .catch(log.error);
  }

  close() {
    return new Promise((resolve, reject) => {
      if (this.connection && this.connection.close) {
        this.connection.close(() => {
          log.info('Mongoose connection closed');
          resolve(true);
        });
      } else {
        reject(false);
      }
    });
  }
}
