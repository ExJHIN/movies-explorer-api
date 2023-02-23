const RegExp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/;
const { Joi, celebrate, errors } = require('celebrate');
const movies = require('express').Router();

const {
  createMovie,
  deleteMovie,
  readMoviesMe,
} = require('../controllers/movies');

// Возвращает фильмы пользователя
movies.get('/', readMoviesMe);

movies.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(RegExp),
    trailerLink: Joi.string().required().pattern(RegExp),
    thumbnail: Joi.string().required().pattern(RegExp),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

movies.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex(),
  }),
}), deleteMovie);

movies.use(errors());

module.exports = movies;
