const catchAsync = require('../utils/catchAsync');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const generateJWT = require('./../utils/jwt');
const AppError = require('./../utils/appError');
const storage = require('../utils/firebase');


const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');


exports.signUp = catchAsync(async (req, res, next) => {
    const { name, email, password, description } = req.body;

    if (!req.file) {
        return next(new AppError('please upload a file', 400));
    }

    const imgRef = ref(storage, `users/${Date.now()}-${req.file.originalname}`);
    const imgUpload = await uploadBytes(imgRef, req.file.buffer)

    const salt = await bcrypt.genSalt(12);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name: name.toLowerCase().trim(),
        email: email.toLowerCase().trim(),
        password: encryptedPassword,
        description,
        profileImgUrl: imgUpload.metadata.fullPath,
    });

    const tokenPromise =  generateJWT(user.id)

    const imgRefToDownload = ref(storage, user.profileImgUrl);
    const urlPromise = getDownloadURL(imgRefToDownload);

     const [token, url] = await Promise.all([tokenPromise, urlPromise]);

     user.profileImgUrl = url;

    return res.status(200).json({
        status: "success",
        message: 'the user has been created',
        token,
        user: {
            id: user.id,
            name: user.email,
            description: user.description,
            profileImgUrl: user.profileImgUrl,
        }
    });
});


exports.signIn = catchAsync(async (req, res, next) => {
    // traemos la informacion de la req.body
    const { email, password } = req.body;
    //buscar el usuario y revisar si existe
    const user = await User.findOne({
      where: {
        email: email.toLowerCase().trim(),
        status: 'active',
      },
    });

    
    if (!user) {
        return next(new AppError(`User with email: ${email} not found`, 404))
    }

    const imgRef = ref(storage, user.profileImgUrl);
    const urlPromise = getDownloadURL(imgRef);

    // valiart si la contraseña es correcta
    if (!(await bcrypt.compare(password, user.password))) {
        return next(new AppError('Incorrec email or password', 401))
    }

    //generar token
    const tokenpromise = generateJWT(user.id)

    const [token, url] = await Promise.all([tokenpromise, urlPromise]);

    user.profileImgUrl = url;

    return res.status(200).json({
      status: 'success',
      message: 'Login succesfully',
      token,
      user: {
        id: user.id,
        name: user.email,
        description: user.description,
        profileImgUrl: user.profileImgUrl,
      },
    });  
});


exports.updatePassword = catchAsync(async (req, res, next) => {
    // traeme el usuairo que viene del req, del middleware
    const { user } = req;
    
    // traerme los datos de la req.body
    const { currentPassword, newPassword } = req.body;
    
    //validar si la contraseña actual  y nueva son iguales enviar un error
    if (currentPassword === newPassword) {
        return next(new AppError('the password cannot be equals', 400))
    }
    
    //validar si la contraseña actual ess igual a la contraseña de bd
    if (!(await bcrypt.compare(currentPassword, user.password))) {
        return next(new AppError('Incorrect password', 401))
    }
    

    //encriptar la nuevva contraseña
    const salt = await bcrypt.genSalt(12);
    const encryptedPassword = await bcrypt.hash(newPassword, salt)

    //actualizar el usuario que viene de la req
    await user.update({
      password: encryptedPassword,
      passwordChangeAt: new Date(),
    });

    //enviar el mensaje al cliente
    return res.status(200).json({
        status: 'succes',
        message: 'The user password was update succesfully!'
    });
});