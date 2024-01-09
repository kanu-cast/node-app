const db = require('../models')

// udate user profile
exports.updateUser = async (req, res, next)=>{
    console.log('this updateuser handler');
    try{
        const user = await db.User.findById(req.userId).select('-password');
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.religion = req.body.religion;
        user.homeTown = req.body.homeTown;
        user.birthDate = req.body.birthDate;
        user.birthMonth = req.body.birthMonth;
        user.birthYear = req.body.birthYear;

        await user.save();
        console.log(user)
        return res.status(200).json({msg:'profile updated succesfully', user})
    }catch(err){
        console.log('This is updateUse Error', err);
        return next(err)
    }
};

//update user password
exports.updatePassword = async (req, res, next)=>{
    console.log('uodate passwor route here')
    try{
        const user = await db.User.findById(req.userId);
        const { password, newPassword } = req.body;
        let isMatch = await user.comparePassword(password);
        if(isMatch){
            user.password = newPassword;
            await user.save()
            return res.status(200).json({ msg:'password updated succesfully'})
        }
        return res.status(401).json({ msg:'Not authorized'})
    }catch(err){
        console.log('This is updatePassword Error', err);
        return next(err)
    }
};

/// update user email
exports.updateEmail = async (req, res, next)=>{
    console.log('update info route here')
    try{
        const foundUsers = await db.User.find({deleted:false,
            $or: [
                {
                    email: {
                    $regex: req.body.email,
                    
                    },
                }
            ]
        });
        console.log('this is foundUsers', foundUsers)
        if(foundUsers.length){
            return res.status(401).json({ msg:'That email is alreay taken'})
        }
        const user = await db.User.findById(req.userId);
        const { password, email} = req.body;
        let isMatch = await user.comparePassword(password);
        if(isMatch){
            user.email = email;
            await user.save();
            return res.status(200).json({ msg:'email updated successfully', user});
        }
        return res.status(401).json({ msg:'Not Authorized '});

    }catch(err){
        console.log('this is update info error', err)
        return next(err)
        
    }
};
/// update user phone
exports.updatePhone = async (req, res, next)=>{
    console.log('update info route here')
    try{
        const foundUsers = await db.User.find({deleted:false,
            $or: [
                {
                    phone: {
                    $regex: req.body.phone,
                    
                    },
                }
            ]
        });
        console.log('this is foundUsers', foundUsers)
        if(foundUsers.length){
            return res.status(401).json({ msg:'That phone is already taken'})
        }
        const user = await db.User.findById(req.userId);
        const { password, phone} = req.body;
        let isMatch = await user.comparePassword(password);
        if(isMatch){
            user.phone = phone;
            await user.save();
            return res.status(200).json({ msg:'phone updated successfully', user});
        }
        return res.status(401).json({ msg:'Not Authorized '});

    }catch(err){
        console.log('this is update info error', err)
        return next(err)
        
    }
};
// update username
exports.updateUserName = async (req, res, next)=>{
    console.log('update info route here')
    try{
        const foundUsers = await db.User.find({deleted:false,
            $or: [
                {
                    userName: {
                    $regex: req.body.userName,
                    
                    },
                }
            ]
        });
        console.log('this is foundUsers', foundUsers)
        if(foundUsers.length){
            return res.status(401).json({ msg:'That userName/email is taken'})
        }
        const user = await db.User.findById(req.userId);
        const { password, userName} = req.body;
        let isMatch = await user.comparePassword(password);
        if(isMatch){
            user.userName = userName;
            await user.save();
            return res.status(200).json({ msg:'username updated successfully', user});
        }
        return res.status(401).json({ msg:'Not Authorized '});

    }catch(err){
        console.log('this is update info error', err)
        return next(err)
        
    }
}

////////////// deactivate account
exports.deactivateAccount = async(req, res, next)=>{
    try{
        const user = await db.User.findById(req.userId);
        let isMatch = await user.comparePassword(req.body.password);
        if(isMatch){
            user.deactivated = true;
            await user.save();
            return res.status(200).json({ msg:'Account deactivated successfully'});
        }
    }catch(err){
        console.log('this is delete info error', err)
        return next(err)
    }
}
////////////// delete account
exports.deleteAccount = async(req, res, next)=>{
    try{
        const user = await db.User.findById(req.userId);
        let isMatch = await user.comparePassword(req.body.password);
        if(isMatch){
            user.deleted = true;
            await user.save();
            return res.status(200).json({ msg:'Account deleted successfully'});
        }
    }catch(err){
        console.log('this is delete info error', err)
        return next(err)
    }
}
