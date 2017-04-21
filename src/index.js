const express = require('express') ;
let app = express();
const port = require('./config/config').port;
const rootRoutes = require('./routes/rootRoutes');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dbConnectionString = require('./config/config').dbConnectionString;

console.log(dbConnectionString);
mongoose.connect(dbConnectionString);
const db = mongoose.connection;
db.on('error', (err) => { console.log('connection failed!', err); } );
db.once('open', () => { console.log('success'); } );

app.use(bodyParser.urlencoded( {extended: false } ));
app.use(bodyParser.json());
app.use(morgan('dev'));

rootRoutes(app);
app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
});