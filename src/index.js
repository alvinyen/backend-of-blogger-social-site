const express = require('express') ;
let app = express();
const port = require('./config/config').port;
const rootRoutes = require('./routes/rootRoutes');
const bodyParser = require('body-parser');
const morgan = require('morgan');

app.use(bodyParser.urlencoded( {extended: false } ));
app.use(bodyParser.json());
app.use(morgan('dev'));

rootRoutes(app);
app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
});