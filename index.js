const express = require('express');
const {connectToMongoDB} = require('./connect');
const urlRoute = require('./routes/url');
const app = express();
const PORT = 8001;
const URL = require('./models/url');

connectToMongoDB('mongodb://127.0.0.1:27017/shortURL')
.then(()=>console.log('MongoDB connected')
);

app.use(express.json());

app.use('/url', urlRoute);

app.get('/:shortID', async (req, res)=>{
    const shortID = req.params.shortID;
    const entry = await URL.findOneAndUpdate({
        shortID
    }, 
    {$push:
        {
            visitHistory:{
                timestamp: Date.now(),
            } 
        },
    },
);
    res.redirect(entry.redirectUrl);
});
app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`);
});