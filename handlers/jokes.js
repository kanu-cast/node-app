const db = require('../models')


// fetch all Jokes
exports.fetchJokes = async (req, res, next)=>{
    try{
        const allJokes = await db.Joke.find({}).populate('author','userName');
        return res.status(200).json({ allJokes });
    }catch(err){
        console.log('This is fetchjokes error', err);
        return next(err)
    }
}


// create new joke handler
exports.createJoke = async (req, res, next)=>{
    console.log('create joke route here');
    try{
        const user = await db.User.findById(req.userId);
        if(!user){
            return res.status(404).json({msg:'user not found'});
        }
        const { 
            name,
            category,
            premise,
            feedline,
            punchline,
            actout,
            tagline1,
            tagline2,
            tagline3,
            typeOfHumor,
            cleanliness,
            funny,
            performedAt,
            testAudienceReaction,
            timesPerformed,
        } = req.body;
        const newJoke = await db.Joke.create({
            name,
            category,
            premise,
            feedline,
            punchline,
            actout,
            tagline1,
            tagline2,
            tagline3,
            typeOfHumor,
            cleanliness,
            funny,
            performedAt,
            testAudienceReaction,
            timesPerformed,
            author: user._id
        });
        await newJoke.save();
        user.jokes.push(newJoke._id);
        await user.save();
        return res.status(201).json({ msg:'joke created successfully', newJoke });
    }catch(err){
        console.log('This is createJoke error', err);
        return next(err);
    }
}

// update joke handler
exports.updateJoke = async (req, res, next)=>{
    console.log('update joke route here');
    try{
        // find joke to be edited
        const foundJoke = await db.Joke.findById(req.params.joke_id);
        if(foundJoke && foundJoke.author == req.userId){
        
            foundJoke.name = req.body.name,
            foundJoke.category = req.body.category,
            foundJoke.premise = req.body.premise,
            foundJoke.feedline = req.body.feedline,
            foundJoke.punchline = req.body.punchline,
            foundJoke.actout = req.body.actout,
            foundJoke.tagline1 = req.body.tagline1,
            foundJoke.tagline2 = req.body.tagline2,
            foundJoke.tagline3 = req.body.tagline3,
            foundJoke.typeOfHumor = req.body.typeOfHumor,
            foundJoke.cleanliness = req.body.cleanliness,
            foundJoke.funny = req.body.funny,
            foundJoke.performedAt = req.body.performedAt,
            foundJoke.testAudienceReaction = req.body.testAudienceReaction,
            foundJoke.timesPerformed = req.body.timesPerformed

            await foundJoke.save();
            return res.status(201).json({ msg:'joke updated successfully', foundJoke });
        }
        return res.status(404).json({ msg:' joke not found'});
    }catch(err){
        console.log('This is createJoke error', err);
        return next(err);
    }
}

// delete joke
exports.deleteJoke = async (req, res, next)=>{
    try{
        const joke = await db.Joke.findById(req.params.joke_id);
        if(!joke) return  res.status(404).json({ msg:'joke not found' });
        if(joke.author == req.userId){
            joke.deleted = true;
            await joke.save();
            return res.status(200).json({ msg:'joke deleted successfully'});
        }
        return res.status(401).json({ msg:'You are not authorised to do that'})
    }catch(err){
        console.log('This is deleJokeError', err);
        return next(err);
    }
}