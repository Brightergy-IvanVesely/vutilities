import config from '../../config';

const domain = config.get('domain');
const cookieDomain = config.get('session:cookiedomain');

class Cors {
  middleware(req, res, next) {
    if (req.header('host')) {
      const host = req.header('host').toLowerCase();
      const origin = host.indexOf(cookieDomain) > -1
        ? req.headers.origin
        : domain;

      res.header('Access-Control-Allow-Origin', origin);
    }

    res.header('Access-Control-Allow-Methods',
      'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers',
      'X-Requested-With, Content-Type, viewerTZOffset');
    res.header('Access-Control-Allow-Credentials', true);

    next();
  }
}



export default function () {
  const cors = new Cors();
  return cors.middleware.bind(cors);
}
