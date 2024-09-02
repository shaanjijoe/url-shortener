const express = require('express');
const path = require('path');
const app = express();
let mapping = {};
let count = 0;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/api/shorten-url', (req, res) => {
    const url = req.query.url;
    
    if (Object.values(mapping).includes(url)) {
        const id = Object.keys(mapping).find(key => mapping[key] === url);
        res.json({ shortUrl: `https://url-shortener-a5kh.onrender.com/expand-url?id=${id}` });
        return;
    } else {
        mapping[count] = url;
        res.json({ shortUrl: `https://url-shortener-a5kh.onrender.com/expand-url?id=${count}` });
        count++;
        // console.log(mapping);
    }
});

app.get('/expand-url', (req, res) => {
    const shortened = req.query.id;

    if (mapping[shortened]) {
        res.redirect(mapping[shortened]);
    } else {
        res.status(404).send('URL not found!');
    }
});

// Catch-all handler for any request that doesn't match the API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
