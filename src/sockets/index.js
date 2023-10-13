const PostServices = require('../services/post.service');

class Sockets {
  constructor(io) {
    this.io = io;
    this.postServices = new PostServices();

    this.socketEvents();
  }

  socketEvents() {
    this.io.on('connection', (socket) => {
      socket.on('new-post', async ({ id }) => {
        try {
          const post = await this.postServices.findPost(id);

            const newPost = await this.postServices.downloadImgPost(post);
            
            socket.broadcast.emit('render-new-post', newPost)
        } catch (error) {
          throw new Error(error);    
        }
      });
    });
  }
}

module.exports = Sockets;
