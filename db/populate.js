require('dotenv').config({});
const { Client } = require("pg");

async function main(){
    console.log("seeding...");
    let client = new Client({
        connectionString:process.env.DATABASE_URL
    })

    await client.connect();
    await client.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            name TEXT, password TEXT, salt INTEGER
        );
    `);
    await client.query(`
        CREATE TABLE IF NOT EXISTS messages (
            num INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            date_posted TEXT, likes INTEGER, title TEXT, message TEXT,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
        );    
    `)
    await client.end();
    console.log("done");
}

main();