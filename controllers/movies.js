const Movies = require('../models/movie');

const {
  OK,
} = require('../constants');

const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const ForbiddenError = require('../errors/Forbidden');

// Создание фильма
const createMovie = (req, res, next) => {
  Movies.create({
    ...req.body, owner: req.user._id,
  })
    .then((newMovie) => res.status(OK).send(newMovie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании фильма.'));
      }
      return next(err);
    });
};

// Удаляет сохранённый фильм по id
const deleteMovie = (req, res, next) => {
  Movies.findById(req.params.movieId)
    .then((movie) => {
      const userId = req.user._id;

      if (movie === null) {
        return next(new NotFoundError('Фильм с указанным _id не найден.'));
      }

      const ownerMovieId = movie ? movie.owner.toString() : null;

      if (userId !== ownerMovieId) {
        return next(new ForbiddenError('Данная фильм пренодлежит другому пользователю'));
      }

      return Movies.findByIdAndRemove(req.params.movieId)
        .orFail(() => {
          throw new NotFoundError('Передан несуществующий _id фильма.');
        })
        .then(() => res.status(OK).send({ message: 'Фильм удален' }))
        .catch((err) => {
          if (err.name === 'CastError') {
            return next(new BadRequestError('Переданы некорректные данные при удаление фильма.'));
          }
          return next(err);
        });
    }).catch(next);
};

// Возвращает все сохранённые текущим  пользователем фильмы
const readMoviesMe = (req, res, next) => {
  Movies.find({ owner: req.user._id })
    .then((movie) => {
      res.status(OK).send(movie);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для получения фильма.'));
      }

      return next(err);
    });
};

module.exports = {
  createMovie,
  deleteMovie,
  readMoviesMe,
};
