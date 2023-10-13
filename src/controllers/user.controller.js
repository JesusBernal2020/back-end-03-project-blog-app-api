const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const storage = require('../utils/firebase');
const { ref, getDownloadURL } = require('firebase/storage');

//buscar todos, findAllUsers
exports.findAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    where: {
      status: 'active',
    },
  });

  const usersPromises = users.map(async (user) => {
    //obtenemos la referencia
    const imgRef = ref(storage, user.profileImgUrl);
    // nos traemos la url
    const url = await getDownloadURL(imgRef);
    // hacemos el cambio del path por la url
    user.profileImgUrl = url;
    //retorna el usuario
    return user;
  });


  const userResolved = await Promise.all(usersPromises);
  return res.status(200).json({
    status: 'Success',
    userResolved,
  });
});

//buscar por id findOneUser
exports.findOneUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  const imgRef = ref(storage, user.profileImgUrl);
  const url = await getDownloadURL(imgRef);

  return res.status(200).json({
    status: 'Success',
    user: {
      name: user.name,
      email: user.email,
      description: user.description,
      profileImgUrl: url,
      role: user.role,
    },
  });
});

//actualizar updateUser
exports.updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { name, description } = req.body;

  await user.update({ name, description });

  return res.status(200).json({
    status: 'Success',
    message: 'User update succesfully!!',
  });
});

//eliminar deleteUser
exports.deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: 'inactive' });

  return res.status(200).json({
    status: 'Success',
    message: 'User deleted successfully!',
  });
});
