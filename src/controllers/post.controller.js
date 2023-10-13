const catchAsync = require('../utils/catchAsync');
const { db } = require('./../database/config'); // esto es para la consulta SQL
const crypto = require('crypto');
const { Post, postStatus } = require('../models/post.model');
const User = require('../models/user.model');
const Comment = require('../models/comment.model');
const PostImg = require('../models/postImg.model');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const storage = require('../utils/firebase');

exports.findAllPost = catchAsync(async (req, res, next) => {
  const posts = await Post.findAll({
    where: {
      status: postStatus.active,
    },
    attributes: {
      exclude: ['status', 'userId'],
    },
    include: [
      {
        model: User,
        attributes: ['id', 'name', 'profileImgUrl', 'description'],
      },
      {
        model: PostImg,
      },
    ],
  });

  const postPromises = posts.map(async (post) => {
    const imgRefUser = ref(storage, post.user.profileImgUrl);
    const urlUser = await getDownloadURL(imgRefUser);

    post.user.profileImgUrl = urlUser;

    const postImgsPromises = post.postimgs.map(async (postImg) => {
      const imgRef = ref(storage, postImg.postImgUrl);
      const url = await getDownloadURL(imgRef);

      postImg.postImgUrl = url;
      return postImg;
    });

    const postImgsResolved = await Promise.all(postImgsPromises);

    post.postimgs = postImgsResolved;

    return post;
  });

  await Promise.all(postPromises);

  return res.status(200).json({
    status: 'succes',
    results: posts.length,
    posts,
  });
});

exports.findMyPost = catchAsync(async (req, res, next) => {
  const { id: userId } = req.seccionUser;

  const post = await Post.findAll({
    where: {
      userId,
      status: postStatus.active,
    },
    include: [
      {
        model: PostImg,
      },
    ],
  });

  if (post.length > 0) {
    const postPromises = post.map(async (post) => {
      const postImgsPromises = post.postimgs.map(async (postImg) => {
        const imgRef = ref(storage, postImg.postImgUrl);
        const url = await getDownloadURL(imgRef);

        postImg.postImgUrl = url;
        return postImg;
      })

      const postImgsResolved = await Promise.all(postImgsPromises);
      post.postimgs = postImgsResolved
    });
    await Promise.all(postPromises)
  }


  return res.status(200).json({
    status: 'success',
    results: post.length,
    post,
  });
});

exports.findUserPost = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.query;

  // esta es una consulta SQL ... pero esta mal, es vulnerable a SQL Injection, COREEGIR
  const query = `SELECT id, title, content, "createdAt", "updatedAt" FROM posts WHERE "userId" = :iduser AND status = :status`;

  const [rows, fields] = await db.query(query, {
    replacements: {iduser: id, status: 'active'},
  });

  return res.status(201).json({
    status: 'success',
    results: fields.rowCount,
    posts: rows,
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  const { title, content } = req.body;
  const { id: userId } = req.seccionUser;

  const post = await Post.create({ title, content, userId });

  const postImgsPromises = req.files.map(async (file) => {
    const imgRef = ref(
      storage,
      `post/${crypto.randomUUID()}-${file.originalname}`
    );
    const imgUploaded = await uploadBytes(imgRef, file.buffer);

    return await PostImg.create({
      postId: post.id,
      postImgUrl: imgUploaded.metadata.fullPath,
    });
  });

  await Promise.all(postImgsPromises);

  return res.status(201).json({
    status: 'success',
    message: 'the post has been created',
    post,
  });
});

exports.findOnePost = catchAsync(async (req, res, next) => {
  const { post } = req;
  let postImgsPromises = [];
  let userImgsCommentPromise = [];

  const imgRefUserProfile = ref(storage, post.user.profileImgUrl);
  const urlUserProfile = await getDownloadURL(imgRefUserProfile);

  post.user.profileImgUrl = urlUserProfile;

  if (post.postimgs.length > 0) {
    postImgsPromises = post.postimgs.map(async (postImg) => {
      const imgRef = ref(storage, postImg.postImgUrl);
      const url = await getDownloadURL(imgRef);

      postImg.postImgUrl = url;

      return postImg;
    });
  }

  if (post.comments.length > 0) {
    userImgsCommentPromise = post.comments.map(async (comment) => {
      const imgRef = ref(storage, comment.user.profileImgUrl);
      const url = await getDownloadURL(imgRef);

      comment.user.profileImgUrl = url;
      return comment;
    });
  }

  const arrPromises = [...postImgsPromises, ...userImgsCommentPromise];

  await Promise.all(arrPromises);

  return res.status(200).json({
    status: 'success',
    post,
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const { title, content } = req.body;
  const { post } = req;

  await post.update({
    title,
    content,
  });

  return res.status(200).json({
    status: 'success',
    message: 'the post has update',
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const { post } = req;

  await post.update({ status: postStatus.disabled });
  return res.status(200).json({
    status: 'succes',
    message: 'the post has been deleted',
  });
});
