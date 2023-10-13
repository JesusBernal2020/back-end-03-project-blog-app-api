const catchAsync = require('../utils/catchAsync');
const Comment = require('../models/comment.model');
const AppError = require('../utils/appError');

exports.validComment = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const comment = await Comment.findOne({
    where: {
      status: true,
      id,
    },
  });

  if (!comment) {
    return next(new AppError('Comment not found', 404));
  }

  req.comment = comment;
  next();
});
