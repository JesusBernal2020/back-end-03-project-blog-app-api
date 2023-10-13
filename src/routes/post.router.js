const express = require('express');

const postController = require('../controllers/post.controller');

//middlewares
const authMiddleware = require('./../middlewares/auth.middleware');
const validationMiddleware = require('./../middlewares/validations.middleware');
const postMiddlewarew = require('./../middlewares/post.middleware');
const userMiddleware = require('./../middlewares/user.middleware');
const upload = require('./../utils/multer');


const router = express.Router();

router
  .route('/')
  .get(postController.findAllPost)
  .post(
    upload.array('postImgs', 3), //al utilizar el upload de multer me va a permitir tener acceso a la req.files
    authMiddleware.protect,
    validationMiddleware.createPostValidation,
    postController.createPost
  );

router.use(authMiddleware.protect);

router.get('/me', postController.findMyPost);

router.get('/profile/:id', userMiddleware.validUser, postController.findUserPost);

router
  .route('/:id')
  .get(postMiddlewarew.validPostPerFindOne, postController.findOnePost)
  .patch(
    postMiddlewarew.validPost,
    validationMiddleware.createPostValidation,
    authMiddleware.protectAccountOwner,
    postController.updatePost
  )
  .delete(
    postMiddlewarew.validPost,
    authMiddleware.protectAccountOwner,
    postController.deletePost
  );
module.exports = router;
