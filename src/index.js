

const express = require('express')
const path = require('path')
const exhbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const {dbConnection} = require('./db')
const passport = require('passport');
const flash = require('connect-flash')
const dotenv = require("dotenv");


dotenv.config();
//Initialization
const app = express()
dbConnection()
require('./config/passport')
//Setting
app.set('port',process.env.PORT||3000);
app.set('views',path.join(__dirname,'views')) //La ruta de la carpeta views
app.engine('.hbs',exhbs.engine({
    defaultLayout:'main',
    layoutDir: path.join(app.get('views'),'layouts'),
    partialsDir:path.join(app.get('views'),'partials'),
    extname: '.hbs'
}));
app.set('view engine','.hbs');

//Middlewares
app.use(express.urlencoded({extended:false}))
app.use(methodOverride(' method'))
app.use(session({
    secret:'mysecretApp',
    resave:true,
    saveUninitialized:true
}))
app.use(passport.initialize());
app.use(passport.session())
app.use(flash())
//GlobalVariables
app.use((req,res,next)=>{
    res.locals.succes_msg = req.flash('succes_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})
//Routes

app.use(require('./routes/index'))
app.use(require('./routes/notes'))
app.use(require('./routes/users'))

//StaticFiles
app.use(express.static(path.join(__dirname,'public')))
//Server is listenning
app.listen(app.get('port'),()=>{
    console.log('Server escuchando en el puerto',app.get('port'))
})
