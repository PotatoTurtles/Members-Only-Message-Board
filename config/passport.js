const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
let db = require('../db/queries');
let bcrypt = require('bcrypt')

passport.use(new LocalStrategy(async (username,password,done)=>{
    try {
        const rows = await db.getUser(username.trim());
        console.log(rows);
        if(rows.length){
            for(let i = 0; i<rows.length;i++){
                console.log("Correct Username: '"+rows[i].name+"'");
                console.log("Correct Password: '"+rows[i].password+"'");
                if(await bcrypt.compare(password.trim(),rows[i].password)){
                    return done(null,rows[i])
                }
            }
        }
        console.log("Incorrect Username: '"+username+"'");
        console.log("Incorrect Password: '"+password+"' ");

        return done(null,false,{message:"Username or Password is Wrong."});
    } catch (error) {
        return done(error)
    }
}));

passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser(async (id,done)=>{
    try {
        const user = await db.getUserbyID(id);
        done(null,user);
    } catch (error) {
        done(error);
    }
})

module.exports=passport;