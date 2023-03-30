const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = require('../middlewares/auth');
const { JWT_SECRET_DEVELOP } = require('../constants');

const {
  OK,
  CREATED,
} = require('../constants');

const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const ConflictError = require('../errors/conflictError');

// Контроллер login
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // Проверяем пароль в зашифрованном виде
      const token = jwt.sign({ _id: user.id }, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEVELOP, { expiresIn: '7d' });
      bcrypt.compare(password, user.password);
      return res.status(OK).send({ token });
    })
    .catch(next);
};

// Создаем пользователя
const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10).then((hashpassword) => User.create({
    name,
    email,
    password: hashpassword,
  }))
    .then((user) => res.status(CREATED).send({
      _id: user._id,
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('email занят'));
      }

      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении профиля. Заполните поля, в них должно быть от 2 до 30 символов'));
      }
      return next(err);
    });
};

// Получение информации о текущем пользователе
const gettingUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw next(new NotFoundError('Пользователь по указанному _id не найден.'));
    })
    .then((user) => {
      const userData = {
        name: user.name,
        email: user.email,
      };
      res.status(OK).send(userData);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные при поиске пользователя.'));
      }
      return next(err);
    });
};

// Обновление данных пользователя
const updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(() => {
      throw next(new NotFoundError('Пользователь по указанному _id не найден.'));
    })
    .then((updateUserProfile) => {
      const userDataProfile = {
        name: updateUserProfile.name,
        email: updateUserProfile.email,
      };
      res.status(OK).send(userDataProfile);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      }
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким email уже существует!'));
      }
      return next(err);
    });
};

// Экспорируем функций
module.exports = {
  createUser,
  updateUser,
  login,
  gettingUserInfo,
};
