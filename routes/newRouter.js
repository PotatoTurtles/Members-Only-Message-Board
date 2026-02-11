const {Router} = require('express');
const passport = require('passport');
let db = require('../db/queries');

const newRouter = Router();

newRouter.get('/',(req,res)=>{
    if(req.isAuthenticated()){
        res.render('new');
    }
    else{
        res.redirect('/');
    }
})
newRouter.post('/',async (req,res)=>{
    if(req.isAuthenticated()){
        await db.addMessage(req.user.id,req.body.title,req.body.message);
        res.redirect('/');
    }
})

module.exports=newRouter;