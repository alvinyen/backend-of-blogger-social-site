const port = require('./config/config').port;
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const socketServer =require('socket.io');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const serve = http.createServer(app);
const io = socketServer(serve);
serve.listen(port,()=> {console.log(`+++Gethyl Express Server with Socket Running on ${port}!!!`)});

const CommentModel = require('./models/CommentModel');

io.on('connection', async (socket) => {
  console.log(socket.handshake.query);
  socket.emit('news', { hello: 'world' }); // to confirm socket.io connection is alive

  if (socket.handshake.query.post_id !== undefined) {
    const post_id = mongoose.Types.ObjectId(socket.handshake.query.post_id);
    await CommentModel.find({ post_id }, 'commentId name when comment').sort({ commentId: -1 }).exec( async function (err, commentsArray) {
      if (err) return console.log(err);
      console.log(commentsArray);
      await socket.emit('initialComments', {
        comments: commentsArray,
        message: '你得到所有comments了呢！！'
      });
    });
  }

  socket.on('my other event', function (data) {
    console.log(data);
  });
});

// io.on('connection',  (socket) => {
//     socket.emit('news', { hello: 'world' });
//     socket.on('my other event', function (data) {
//       console.log(data);
//     });
// });

const rootRoutes = require('./routes/rootRoutes');
const morgan = require('morgan');
const dbConnectionString = require('./config/config').dbConnectionString;
const User = require('./models/user');
const PostModel = require('./models/post');

const cors = require('cors');

console.log(dbConnectionString);
mongoose.connect(dbConnectionString);

const db = mongoose.connection;
db.on('error', (err) => { console.log('connection failed!', err); });
db.once('open', () => { 
    console.log('connection successed');
//     // let testPost1 = new PostModel(
//     //     {
//     //         name: 'best football game',
//     //         content: 'best is the best',
//     //     }
//     // );
//     // testPost1.save((err, result) => {
//     //     if (err) { console.log('testPost1 save failed：', err); }
//     //     console.log('testPost1 save successed：', result);
//     // });
//     // PostModel.find({}).sort({ postId: 1 }).exec((err, postArray) => {
//     //     console.log(postArray);
//     // });
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));

const corsOptions = {
  origin: 'http://localhost:8080',
  credentials: true
};
app.use(cors(corsOptions));

rootRoutes(app);
