const {
  SERVER_ERROR,
} = require('../constants');

module.exports.globalErrorHandler = (err, req, res, next) => {
  const { statusCode = SERVER_ERROR, message } = err;
  res.status(statusCode).send({
    message:
      statusCode === SERVER_ERROR
        ? 'Произошла неизвестная ошибка, проверьте корректность запроса'
        : message,
  });
  return next();
};
