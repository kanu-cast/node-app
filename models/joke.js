const mongoose = require('mongoose');

const jokeSchema = new mongoose.Schema ({

    name: { type: String, required: true },
    category: { type: String, required: true },
    premise: { type: String, required: true },
    feedline: { type: String, required: true },
    punchline:{ type: String, required: true },
    actout:{ type: String },
    tagline1: { type: String },
    tagline2: { type: String },
    tagline3: { type: String },
    typeOfHumor: { type: String },
    cleanliness: { type: String},
    funny: { type: String},
    performedAt: [],
    testAudienceReaction: { type: String },
    timesPerformed:{type: Number},
    deleted: { type: Boolean, default: false },
    author: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
},
{timestamps: true}
)
const Jokes = mongoose.model("Joke", jokeSchema);
module.exports = Jokes;