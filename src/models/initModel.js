const Comment = require('./comment.model');
const { Post } = require('./post.model');
const PostImg = require('./postImg.model');
const User = require('./user.model');

const initModel = () => {
    User.hasMany(Post, {foreignKey: 'userId'});
    Post.belongsTo(User, { foreignKey: 'userId' });
    
    Post.hasMany(Comment);
    Comment.belongsTo(Post);

    User.hasMany(Comment);
    Comment.belongsTo(User); 

    Post.hasMany(PostImg);
    PostImg.belongsTo(Post);
}


module.exports = initModel;