require("dotenv").config();
const express = require('express');
const app = express();
const port = 4000;
const cors = require('cors')
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const jokeRoutes = require('./routes/jokes');
const cookieParser = require("cookie-parser");

const { checkIsUserLoggedIn } = require('./middlewares');

app.use(cors({
    origin:["http://localhost:3000",],
    methods:["GET", "POST", "PUT"],
    credentials:true
}));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));

app.use("/api/home", (req, res)=>{
    res.send('Welcome to Jokes academy');
});

app.use("/api/auth", authRoutes);
app.use("/api/users", 
    checkIsUserLoggedIn, 
    userRoutes
);
app.use("/api/jokes", 
    checkIsUserLoggedIn, 
    jokeRoutes
);

app.listen(port, err =>{
    if(err){
        throw new err;
    }
    console.log(`> started server on ${port}`);
})