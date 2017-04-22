const express = require('express') ;
let app = express();
const port = require('./config/config').port;
const rootRoutes = require('./routes/rootRoutes');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dbConnectionString = require('./config/config').dbConnectionString;
const User = require('./models/user');
const cors = require('cors') ;

console.log(dbConnectionString);
mongoose.connect(dbConnectionString);
const db = mongoose.connection;
db.on('error', (err) => { console.log('connection failed!', err); } );
db.once('open', () => { 
    console.log('success'); 
    //1. 創建實體
    let user = new User({
        username: 'alvinnnn',
        password: 'cestlavi'
    });
    //2. 保存
    user.save();
} );

app.use(bodyParser.urlencoded( {extended: false } ));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());

rootRoutes(app);
app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
});