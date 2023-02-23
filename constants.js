const OK = 200;
const CREATED = 201;

const NOT_FOUND_USER = 'Неправильные почта или пароль';
const CONFLICT_EMAIL = 'Пользователь с такой почтой уже существует';
const allowedCors = [
  'https://movies.explorer.nomoredomains.work',
  'http://movies.explorer.nomoredomains.work',
  'http://localhost:3000',
  'http://localhost:3001',
];

module.exports = {
  OK,
  CREATED,
  NOT_FOUND_USER,
  CONFLICT_EMAIL,
  allowedCors,
};
