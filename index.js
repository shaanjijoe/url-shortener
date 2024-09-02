const express = require('express');
const path = require('path');
const { URL } = require('url'); // Import URL module
const app = express();
let mapping = {};
let count = 0;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Shorten URL endpoint
app.get('/api/shorten-url', (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).send('URL is required');
    }

    try {
        // Normalize the URL to ensure it has a scheme
        let normalizedUrl;
        try {
            normalizedUrl = new URL(url).href; // Normalize if URL is absolute or relative
        } catch {
            // If URL lacks a scheme, add a default scheme to make it absolute
            normalizedUrl = new URL('http://' + url).href;
        }

        if (Object.values(mapping).includes(normalizedUrl)) {
            const id = Object.keys(mapping).find(key => mapping[key] === normalizedUrl);
            res.json({ shortUrl: `https://url-shortener-a5kh.onrender.com/expand-url?id=${id}` });
        } else {
            mapping[count] = normalizedUrl;
            res.json({ shortUrl: `https://url-shortener-a5kh.onrender.com/expand-url?id=${count}` });
            count++;
        }
    } catch (error) {
        // Handle any errors that occur during URL processing
        res.status(400).send('Invalid URL');
    }
});

// Expand URL endpoint
app.get('/expand-url', (req, res) => {
    const shortened = req.query.id;

    if (mapping[shortened]) {
        // Redirect to the URL stored in mapping
        res.redirect(mapping[shortened]);
    } else {
        res.status(404).send('URL not found!');
    }
});

// Catch-all handler for any request that doesn't match the API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
