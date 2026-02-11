const {Router} = require('express');
const passport = require('passport');
let db = require('../db/queries');

const registerRouter = Router();

registerRouter.get('/',(req,res)=>{
    res.render('register');
})
registerRouter.post('/',async (req,res,next)=>{
    await db.addUser(req.body.username.trim(),req.body.password.trim());
    passport.authenticate('local');
    res.redirect('/');
})

module.exports=registerRouter;