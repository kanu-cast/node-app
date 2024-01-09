const mongoose = require("mongoose");
mongoose.set("debug", true);
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGO_URI,{
    useUnifiedTopology:true,
    useNewUrlParser:true,
}).then(()=>console.log('connected to Database'))
.catch(e=>console.log(e));

module.exports.User = require("./user");
module.exports.Joke = require("./joke");
