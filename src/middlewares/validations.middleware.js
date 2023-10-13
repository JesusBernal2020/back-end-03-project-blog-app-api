const { body, validationResult } = require('express-validator');

const validFiels = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.mapped(),
    });
  }

  next();
};

exports.updateUserValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characteres long'),
  validFiels,
];

exports.createUserValidation = [
  body('name').notEmpty().withMessage('Name is required!'),
  body('email')
    .notEmpty()
    .withMessage('Email id required')
    .isEmail()
    .withMessage('Email must be a correc format'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must have a least 8 characteres')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must have cotain a least one leater'),
  body('description').notEmpty().withMessage('Description is required'),
  validFiels,
];

exports.loginUserValidation = [
  body('email')
    .notEmpty()
    .withMessage('Email id required')
    .isEmail()
    .withMessage('Email must be a correc format'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must have a least 8 characteres')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must have cotain a least one leater'),
  validFiels,
];

exports.updatePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('current password is requerid')
    .isLength({ min: 8 })
    .withMessage('Password must have a least 8 characteres')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must have cotain a least one leater'),
  body('newPassword')
    .notEmpty()
    .withMessage('new password is requerid')
    .isLength({ min: 8 })
    .withMessage('Password must have a least 8 characteres')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must have cotain a least one leater'),
  validFiels,
];

exports.createPostValidation = [
  body('title').notEmpty().withMessage('Title is requerid'),
  body('content').notEmpty().withMessage('Content is required'),
  validFiels,
];

exports.createCommentValidation = [
  body('text').notEmpty().withMessage('Text is required'),
  body('postId').notEmpty().withMessage('PostId is Required'),
  validFiels,
];

exports.updateCommentValidation = [
  body('text').notEmpty().withMessage('text is required'),
  validFiels,
];
