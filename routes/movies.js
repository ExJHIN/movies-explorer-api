const movies = require('express').Router();

const {
  createMovie,
  deleteMovie,
  readMoviesMe,
} = require('../controllers/movies');

const { createMovieValidator, deleteMovieValidator } = require('../middlewares/validate');

// Возвращает фильмы пользователя
movies.get('/', readMoviesMe);

movies.post('/', createMovieValidator, createMovie);

movies.delete('/:movieId', deleteMovieValidator, deleteMovie);

module.exports = movies;
