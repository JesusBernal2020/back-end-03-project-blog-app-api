const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { promisify } = require('util');

exports.protect = catchAsync(async (req, res, next) => {
  //extrar el token que viene de los headers

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  //valiar si el toen existe
  if (!token) {
    return next(
      new AppError('You are not looged in!, please log in to get access', 401)
    );
  }

  // decodificar el token
  const decode = await promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT_SEED
  );

  //buscar e usuario y validar si existe
  const user = await User.findOne({
    where: {
      id: decode.id,
      status: 'active',
    },
  });

  //si no ediste el usuario
  if (!user) {
    return next(
      new AppError('The owner of this token is not longer available', 401)
    );
  }

  //valodar el tiempo en el que se cambi la contraseña para saber si el token generado fue generado despues del cambio de contraseña
  if (user.passwordChangeAt) {
    const changedTimeStamp = parseInt(
      user.passwordChangeAt.getTime() / 1000,
      10
    );

    if (decode.iat < changedTimeStamp) {
      return next(
        new AppError('User recently changed password! please login again', 401)
      );
    }
  }

  // usuarios en seccion
  req.seccionUser = user;

  next();
});

exports.protectAccountOwner = (req, res, next) => {
  const { user, seccionUser } = req;

  if (user.id !== seccionUser.id) {
    return next(new AppError('You do not own this acoount', 401));
  }

  next();
};

exports.restricTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.seccionUser.role)) {
      return next(
        new AppError('you do not have permission to perfom this action', 403)
      );
    }

    next();
  };
};
