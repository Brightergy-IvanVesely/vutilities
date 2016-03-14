import _ from 'lodash';
import nconf from 'nconf';
import path from 'path';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envConfigFilepath = path.join(__dirname, 'environment',
  `${process.env.NODE_ENV}.json`);
const defConfigFilepath = path.join(__dirname, 'environment',
  'default.json');

nconf
  .env({ separator: '_' })
  .file(envConfigFilepath)
  .file('defaults', defConfigFilepath);

function _convertKeysLoLowerCase(obj) {
  _.each(obj, (value, key) => {
    delete obj[key];
    key = key.toLowerCase();
    obj[key] = value;

    if (_.isObject(value) && !_.isArray(value)) {
      _convertKeysLoLowerCase(value);
    }
  });

  return obj;
}

function get(key) {
  let value = nconf.get(key.toUpperCase());

  if (_.isUndefined(value)) {
    value = nconf.get(key);
    if (_.isUndefined(value)) {
      return undefined;
    }
  }
  if (_.isNumber(value) || _.isBoolean(value) || _.isArray(value)) {
    return value;
  }
  if (_.isObject(value)) {
    return _convertKeysLoLowerCase(value);
  }
  if (value.match(/^\d$/g)) {
    return parseInt(value);
  }
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  return value;
}

function getMany(...args) {
  const keys = Array.prototype.slice.apply(args);

  if (keys.length === 0) {
    return null;
  }

  const values = {};

  _.each(keys, key => {
    return values[key] = get(key);
  });

  return values;
}

const configFns = {
  get,
  getMany
};

export default configFns;
