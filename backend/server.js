const app = require("./app");
const connectDatabase = require('./config/db')
const dotenv = require("dotenv");


//Handling uncaught Exception
process.on("uncaughtException", (err) =>{
    console.log(`Error: ${err.message}`)
    console.log(`Shutting down the server due to Rejection`)
    process.exit(1)
})

//config
dotenv.config({path:"backend/config/config.env"});
//connecting to database
connectDatabase();

const server = app.listen(process.env.PORT, ()=>{
    console.log(`Serveris working on http://localhost:${process.env.PORT}`)
})



// unhandled Promise rejection
process.on("unhandledRejection",(err) =>{
    console.log(`Error: ${err.message}`)
    console.log(`Shutting down the server due to Rejection`)

    server.close(()=>{
        process.exit(1)
    })
})