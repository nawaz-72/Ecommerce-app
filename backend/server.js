const app = require("./app");
const connectDatabase = require('./config/db')
const dotenv = require("dotenv");


//config
dotenv.config({path:"backend/config/config.env"});
//connecting to database
connectDatabase();


app.listen(process.env.PORT, ()=>{
    console.log(`Serveris working on http://localhost:${process.env.PORT}`)
})