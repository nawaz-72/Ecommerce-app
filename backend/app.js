const express = require("express");
const errorMiddleware = require('./middleware/err')

const app = express();
app.use(express.json())

//Route imports
const product = require("./routes/productRoute")
const user = require("./routes/userRoute")

app.use("/api/v1", product);
app.use("/api/v1", user);

//Middleware For Error
app.use(errorMiddleware);

module.exports = app; 