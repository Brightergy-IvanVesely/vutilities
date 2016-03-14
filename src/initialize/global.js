//THIS INITIALIZATION FILE IS NEEDED FOR OVERRIDING BABEL STUFF (SUCH AS PROMISE)
//replacing default promise library to bluebird
import bluebird from 'bluebird';

require('babel-runtime/core-js/promise').default = bluebird;
GLOBAL.Promise = bluebird;

export default function () {
  console.log('Application initialized');
}
