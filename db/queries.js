const pool = require('./pool');
let bcrypt = require('bcrypt');

async function getUser(username){
    if(username.length>0){
        const {rows} = await pool.query('SELECT * FROM users WHERE name=$1',[username])
        return rows
    }
    return false
}
async function getUserbyID(id){
    if(id){
        const {rows} = await pool.query('SELECT * FROM users WHERE id=$1',[id])
        return rows[0]
    }
    return false
}
async function addUser(username,password){
    if(username.length>0&&password.length>0){
        const rows = await getUser(username);
        password=await bcrypt.hash(password, 12);
        if(rows.length<=0){
            return await pool.query('INSERT INTO users (name,password) VALUES ($1,$2)',[username,password]);
        }
    }
    throw new Error("Invalid user signup.");
}
async function addMessage(user_id,title,message){
    let query =`INSERT INTO messages (date_posted,likes,title,message,user_id) VALUES ($1, $2, $3, $4, $5)`;
    await pool.query(query,[Date(),0,title,message,user_id]);
}
async function getMessages(){
    let {rows}=await pool.query('SELECT users.name,messages.title,messages.message,messages.date_posted,messages.likes,messages.num FROM users RIGHT JOIN messages ON users.id=messages.user_id;');
    return rows;
}
async function addLike(id){
    let message = await pool.query('SELECT * FROM messages WHERE num=$1',[id])
    await pool.query('UPDATE messages SET likes=$1 WHERE num=$2;',[message.rows[0].likes+1,id])
}

module.exports={
    getUser,
    getUserbyID,
    addUser,
    addMessage,
    getMessages,
    addLike
}