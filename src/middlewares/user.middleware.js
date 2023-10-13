const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');


exports.validUser = catchAsync(async (req, res, next) => {
  //traer el id de la req.params
    const { id } = req.params;
 // busvar el usuario con status active y el id resivido
    const user = await User.findOne({
      where: {
        id,
        status: 'active',
      },
    });
    //valido si no existe envio el error
    if (!user) {
      return next(new AppError(`User with id ${id} not found!!`, 404));
    }
    //abjunto el usuario por la req, y le doy paso para que avance con el next
    req.user = user;
    next();
});



