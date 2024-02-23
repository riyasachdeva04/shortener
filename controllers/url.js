const shortid = require('shortid');
const URL = require('../models/url');
const { response } = require('express');

async function handleGenerateNewShortURL(req, res){
    const body = req.body;
    if(!body.url) return response.status(400).json({error: 'url is required'});
    const shortID = shortid();
    await URL.create({
        shortID: shortID,
        redirectUrl: body.url,
        visitHistory: []
    });
    // return res.json({id: shortID});
    return res.render('home', {id: shortID});
}

async function handleGetAnalytics(req, res){
    const shortId = req.params.shortId;
    const result = await URL.findOne({shortId});
    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
};


module.exports = {handleGenerateNewShortURL, handleGetAnalytics};