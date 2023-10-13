require('dotenv').config();
const app = require('./app');
const { db } = require('./database/config');
const initModel = require('./models/initModel');
const { Server } = require('socket.io');
const Sockets = require('./sockets');
// const cron = require('./database/config');


// cron.schedule('* * * * *', () => {
//   console.log('runing a task every minute')
// })

db.authenticate()
  .then(() => console.log('Database connected...🛰️'))
  .catch((err) => console.log(err));

initModel();

db.sync()
  .then(() => console.log('Database synchronized...📡'))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 3999;
const server = app.listen(PORT, () => {
  console.log(`server runing on port ${PORT}...🚀`);
});


const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
})

new Sockets(io); // con esto inicializo los sockets