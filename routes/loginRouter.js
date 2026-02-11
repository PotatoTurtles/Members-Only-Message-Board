const {Router} = require('express');
const passport = require('passport');

const loginRouter = Router();
loginRouter.get('/',(req,res)=>{
    res.render('login');
})
loginRouter.post('/',passport.authenticate('local',{ failureRedirect: '/', successRedirect: '/' }),(req,res)=>{
    if (err) next(err);
    res.redirect('/');
})

module.exports=loginRouter;