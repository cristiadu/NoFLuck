import express, { static } from 'express';
import { json, urlencoded } from 'body-parser';
import methodOverride from 'method-override';

var app = express();
var port = process.env.PORT || 8000;

app.use(json({ limit: '50mb' }));
app.use(json({ type: 'application/vnd.api+json' }));
app.use(urlencoded({ limit: '50mb', extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /public/img will be /img for users
app.use(static(__dirname + '/public'));

// <!----- App Routes ----->
require('./routes').default(app);

// starts our app at http://localhost:PORT
app.listen(port);

exports = module.exports = app;
