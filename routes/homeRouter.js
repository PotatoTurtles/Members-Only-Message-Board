const {Router} = require('express');
const passport = require('passport');
let db = require('../db/queries');

let homeRouter = Router();

homeRouter.use('/',async (req,res)=>{
    let messages = await db.getMessages();
    res.render('home',{messages:messages,auth:req.isAuthenticated()});
})
module.exports=homeRouter;