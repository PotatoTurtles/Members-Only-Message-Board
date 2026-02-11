require('dotenv').config({});

const express = require("express");
const session = require("express-session");
const pg = require('pg');
const PgStore = require('connect-pg-simple')(session);
const passport = require('./config/passport');

let db = require('./db/queries');

const homeRouter = require('./routes/homeRouter');
const loginRouter = require('./routes/loginRouter');
const registerRouter = require('./routes/registerRouter')
const newRouter = require('./routes/newRouter');

const path = require('node:path');
const port = process.env.PORT || 3000;

const app = express();
app.use(express.urlencoded({extended:true}));

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

const pool = new pg.Pool({
    connectionString:process.env.DATABASE_URL
});

app.use(session({
    store:new PgStore({
        pool:pool,
        tableName:'session',
        createTableIfMissing:true
    }),
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized: false,
    cookie:{
        maxAge:1000 * 60 * 60 * 24
    }
}));

app.use(passport.initialize());
app.use(passport.session())

app.use('/login',loginRouter);
app.use('/register',registerRouter);
app.post('/like',async (req,res)=>{
    if(req.isAuthenticated() && req.body.messageId.length>0){
        await db.addLike(req.body.messageId);
    }
    res.redirect('/');
})
app.use('/logout',(req,res,next)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
})
app.use('/new',newRouter);
app.use('/',homeRouter);

app.listen(port,err=>{
    if(err){
        throw err
    }
    console.log(`Express app - listening on port ${port}!`);
})