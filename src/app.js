import express, { static as StaticLib } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import methodOverride from 'method-override';
import routes from './routes.js';

const { json, urlencoded } = bodyParser;
const __dirname = path.dirname(new URL(import.meta.url).pathname);

console.log(__dirname);

const app = express();
const port = process.env.PORT || 8000;

app.use(json({ limit: '50mb' }));
app.use(json({ type: 'application/vnd.api+json' }));
app.use(urlencoded({ limit: '50mb', extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /public/img will be /img for users
app.use(StaticLib(`${__dirname}/public`));

// <!----- App Routes ----->
routes(app);

// starts our app at http://localhost:PORT
app.listen(port);

export default app;
