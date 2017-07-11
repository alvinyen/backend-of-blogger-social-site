const express = require('express') ;
let app = express();
const port = require('./config/config').port;
const rootRoutes = require('./routes/rootRoutes');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dbConnectionString = require('./config/config').dbConnectionString;
const User = require('./models/user');
const PostModel = require('./models/post');
const cors = require('cors') ;

console.log(dbConnectionString);
mongoose.connect(dbConnectionString);
const db = mongoose.connection;
db.on('error', (err) => { console.log('connection failed!', err); } );
db.once('open', () => { 
    console.log('connection successed');
    let testPost1 = new PostModel(
        {
            name: 'best football game',
            content: 'best is the best',
        }
    );
    testPost1.save((err, result) => {
        if (err) { console.log('testPost1 save failed：', err); }
        console.log('testPost1 save successed：', result);
    });
    PostModel.find({}).sort({ postId: 1 }).exec((err, postArray) => {
        console.log(postArray);
    });
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());

rootRoutes(app);
app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
});