const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema ({
    userName:{ type: String, required:true , unique:true},
    email:{ type: String, required:true , unique:true},
    phone:{ type: String, required:true , unique:true},
    firstName:{ type: String, required:true },
    lastName:{ type: String, required:true },
    password:{ type: String, required:true },
    birthDate:{ type: String, required:true },
    birthMonth:{ type: String, required:true },
    birthYear:{ type: String, required:true },
    homeTown:{ type: String},
    religion:{ type: String},
    jokes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Joke"
        }
    ],
    deactivated:{type:Boolean, default:false},
    deleted:{type:Boolean, default:false}

},
{timestamps: true}
)

// Schema hooks

userSchema.pre("save", async function(next){
    try{
        if(!this.isModified("password")){
            return next();
        }
        let hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
    }catch(err){
        return next(err);
    }
});

// Schema methods
userSchema.methods.comparePassword = async function(candidatePassword, next) {
    try {
      let isMatch = await bcrypt.compare(candidatePassword, this.password);
      return isMatch;
    } catch (err) {
        console.log(err);
      return next(err);
    }
  };
userSchema.plugin(uniqueValidator,{message:"username is already registered under another user"});
const User = mongoose.model("User", userSchema);
module.exports = User;