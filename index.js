const express = require('express');
const {connectToMongoDB} = require('./connect');

const URL = require('./models/url');
const path = require('path');

const app = express();
const PORT = 8001;

const staticRoute = require('./routes/staticRouter');
const urlRoute = require('./routes/url');
const userRoute = require('./routes/user');

connectToMongoDB('mongodb://127.0.0.1:27017/shortURL')
.then(()=>console.log('MongoDB connected')
);

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.json());
app.use(express.urlencoded({ extended : false }));

app.use('/', staticRoute);

app.get('/test', async (req, res) => {
    const allUrls = await URL.find({});
    return res.render('home', {
        urls: allUrls,
    });
})

app.use('/url', urlRoute);

app.use('/user', userRoute);

app.get('/url/:shortID', async (req, res)=>{
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