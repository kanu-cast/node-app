require("dotenv").config();
const jwt = require("jsonwebtoken");
const db = require("../models");

exports.checkIsUserLoggedIn = async function(req, res, next){
    //console.log('this is req in middleware' , req);
    try{
        console.log('middleware')
        const token = req.cookies.comedy
        if (!token) {
            return res.sendStatus(403);
        }
        const data = jwt.verify(token, process.env.SECRET_KEY);
        req.userId = data.id;
    
        const currentUser = await db.User.findById(data.id);
        console.log('this is currentUser', currentUser)
        currentUser.lastActive = Date.now();
        await currentUser.save();
        console.log('done here')
        return next();  
    }catch(err){
        console.log('this is middleware error', err);
        return next({
            status:401,
            message:"Please log in first"
        });
    }
};