const OK = 200;
const CREATED = 201;

const NOT_FOUND_USER = 'Неправильные почта или пароль';
const TOKEN_ERROR = 'Неправильный токен';
const CONFLICT_EMAIL = 'Пользователь с такой почтой уже существует';
const LOG_IN_INFO = 'Необходимо авторизоваться';

const DATA_BASE_PRODUCTION = 'mongodb://localhost:27017/bitfilmsdb';

const JWT_SECRET_DEVELOP = '337fd74160df4d86dd7435ef560348417';

const allowedCors = [
  'https://movies.explorer.nomoredomains.work',
  'http://movies.explorer.nomoredomains.work',
  'http://localhost:3000',
  'http://localhost:3001',
];

module.exports = {
  TOKEN_JWT: process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : process.env.JWT_SECRET_DEVELOP,
};

module.exports = {
  OK,
  CREATED,
  NOT_FOUND_USER,
  CONFLICT_EMAIL,
  allowedCors,
  TOKEN_ERROR,
  LOG_IN_INFO,
  DATA_BASE_PRODUCTION,
  JWT_SECRET_DEVELOP,
};
