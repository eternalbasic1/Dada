require('dotenv').config()

const mongoose = require('mongoose');
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const cors = require("cors");


//My Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");



//DB Connection
mongoose.set('strictQuery', false);//not very much useful as of now
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("DB CONNECTED"); 
}).catch((err)=>console.log(err));



//PORT
const port = process.env.PORT||8000;

// if( process.env.NODE_ENV == "production"){

//     app.use(express.static("build"));

//     const path = require("path");

//     app.get("*", (req, res) => {

//         res.sendFile(path.resolve(__dirname, 'build', 'index.html'));

//     })


// }



//Starting a Server
app.listen(port,() => {
    console.log(`App is up and running at ${port}`);
});   

