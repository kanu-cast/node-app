const db = require('../models');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');


/// sign up handler 
exports.signUp = async (req, res, next) =>{
    console.log('route here', req.body);

    try{
        const newUser = await db.User.create({
            userName:req.body.userName, 
            firstName:req.body.firstName, 
            lastName:req.body.lastName, 
            password:req.body.password,
            email:req.body.email,
            phone:req.body.phone,
            birthDate: req.body.birthDate,
            birthMonth:req.body.birthMonth,
            birthYear:req.body.birthYear
        });
        await newUser.save();
        const createdUser = await db.User.findById(newUser._id).select('-password');

        const { id, userName, firstName, lastName} = createdUser;
        if(createdUser){
            // assign token
            let token = jwt.sign(
                {
                    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, //30days
                    id,
                    userName,
                    firstName, 
                    lastName, 
                },
                process.env.SECRET_KEY
            );
            //assign cookie
            return res.cookie("comedy", token, {
                httpOnly: true,
                samesite:'none',
                secure:true
            })
            .status(200)
            .json({createdUser, msg:'Created account successfully'});
        }
    }catch(err){
        console.log('This is signup error', err);
        return;
    }
}

/// handle sign in 

exports.signIn = async (req, res, next)=>{
    console.log('sign in route here');
    try{
        // fetch user from db with matching email
        const foundUser = await db.User.find({
            email: req.body.email
        });
        const user = foundUser[0];
        if(user){
            const { id, userName, firstName, lastName} = user;
            // check if passwords match
            let isMatch = await user.comparePassword(req.body.password);
            console.log('this is isMatch', isMatch);
            if(isMatch){
            // assign token
                let token = jwt.sign(
                    {
                        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, //30days
                        id,
                        userName,
                        firstName, 
                        lastName, 
                    },
                    process.env.SECRET_KEY
                );
                //assign cookie
                res.cookie("comedy", token, {
                    httpOnly: true,
                    samesite:'none',
                    secure:true
                })
                .status(200)
                .json({user:user, msg:'Successfully logged you in'});
            }else{
                return res.status(400).json({ msg: 'Invalid username/password combination'})
            }
        }
    }catch(err){
        console.log('This is sign in error', err);
        return next(err);
    }
}

//// handle sign out 

exports.signOut = async(req, res, next) => {
    try{
      const foundUser = await db.User.findById(req.userId);
      if(Object.keys(foundUser).length > 0){
        foundUser.lastActive = Date.now();
        await foundUser.save();
      }else{
        return res.status(401).json({status:401, msg:'sorry, user not found'});
      }
      return res
        .clearCookie("comedy")
        .status(200)
        .json({status:200, userId:foundUser._id, message: "Successfully logged out" });
    }catch(err){
      console.log('This is sign out error', err);
      res.send({status:500, msg:'Sorry!, Something went wrong. Please try again later'});
      return next({err});
    }
};

exports.sendRecoveryEmail = async(req, res, next)=>{
    console.log('recovery route here');
    try{
        const foundUser = await db.User.find({email:req.body.email}).select('-password');
        console.log('this is foundUser', foundUser);
        if(!foundUser.length){
            return res.status(404).json({ msg:'There is no acount under that email'})
        }
        const user = foundUser[0];
        var mailOptions = {
            to: user.email,
            subject: 'Password recovery',
            text: `Hello ${user.firstName}! n\ Your one time password is 33449 n\ This OTP expires in 1 hour. n\ Thanks!`
          }
          if (!isEmail(mailOptions.to)) {
            res.status(401)
              .send({
                message: "Invalid Email"
            });
          }
          console.log(mailOptions);
          smtp.sendMail(mailOptions, function (error, response) {
            if (error) {
              console.log(error);
              res.end("error");
            } else {
              console.log("Email sent ");
              res.end("sent");
            }
          });
        console.log(mailOptions);
    }catch(err){
        console.log('This is sendRecoveryEmail error', err);
        return next(err);
    }
    
}