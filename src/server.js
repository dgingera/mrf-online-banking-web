'use strict';

require('dotenv').config();
const path = require('node:path');
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const pinoHttp = require('pino-http');
const debug = require('debug')('mrf:web');

const accounts = require('./routes/accounts');

const app = express();
app.use(helmet());
app.use(pinoHttp());
app.use(cookieParser());
app.use(express.json({ limit: '64kb' }));
app.use('/api', rateLimit({ windowMs: 60_000, limit: 120 }));
app.use('/api/accounts', accounts);
// The customer-facing single-page app (bundled by `npm run build:client`)
app.use(express.static(path.join(__dirname, '..', 'public')));

const port = Number(process.env.PORT || 8080);
app.listen(port, () => debug('online banking BFF listening on %d', port));
