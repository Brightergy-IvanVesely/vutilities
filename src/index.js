import initialize from './app.initializer';

initialize();

import express from 'express';
import enrouten from 'express-enrouten';
// import Middlewares from './middlewares';
import log from './helpers/logger';

const app = express();

app.set('view engine', 'jade');
app.set('json spaces', 4);
app.set('x-powered-by', false);
app.set('port', process.env.PORT || 3000);

app.enable('trust proxy');
app.locals.pretty = true;

// Middlewares.use(app);

app.use(enrouten({ directory: 'routes' }));

const server = app.listen(app.get('port'), () => {
  log.info(`Express server listening on port ${server.address().port}`);
});
