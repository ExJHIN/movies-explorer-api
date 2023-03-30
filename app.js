require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const index = require('./routes/index');

const SERVER_ERROR = require('./errors/ServerError');

const { DATA_BASE_PRODUCTION } = require('./constants');

const { NODE_ENV, DB_DEFAULT = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

const { globalErrorHandler } = require('./errors/globalErrorHandler');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const {
  allowedCors,
} = require('./constants');

mongoose.connect(NODE_ENV === 'production' ? DB_DEFAULT : DATA_BASE_PRODUCTION, {
  useNewUrlParser: true,
});

const app = express();

app.use(requestLogger);

// Добавил заголовки безопасности
app.use(helmet());

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use('*', (req, res, next) => {
  const { method } = req;
  const { origin } = req.headers;
  const requestHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    return res.end();
  }

  return next();
});

app.use('/api', index);

app.get('/crash-test', () => {
  setTimeout(() => {
    console.log('Сервер сейчас упадёт');
    throw new SERVER_ERROR('Сервер сейчас упадёт');
  }, 0);
});

app.use(errors());

// Вынес централизованный обработчик ошибок в отдельный модуль
app.use(globalErrorHandler);

app.use(errorLogger);

module.exports = app;
