var express = require('express');
var exphbs  = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser'); 
const session = require('express-session');
const upload = require('express-fileupload');
const flash = require('connect-flash');

const port = process.env.PORT || 4500

var app = express();
var hbs = exphbs.create({ /* config */ });
 
// Register `hbs.engine` with the Express app.
app.use(express.static(path.join(__dirname,'public')));
app.engine('handlebars', exphbs({defaultLayout: 'home'})),
app.set('view engine', 'handlebars');
 
// Upload Middleware
app.use(upload());

//Body Parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Session
app.use(session({
    secret: 'mySessionKey',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

//Local variables using middleware
app.use((req,res,next)=>{
  res.locals.success_message = req.flash('success_message');
  res.locals.error_message = req.flash('error_message');
  next();
});

//load routes
const home = require('./routes/home/index');
const fileReader = require('./routes/fileReader');
//use routes
app.use('/',home);
app.use('/fileReader',fileReader);
app.listen(port, ()=>{
    console.log('Listening on port 4500')
});

