const express = require('express');
const app = express();

const shortID = require('shortid');
const validUrl = require('valid-url');

const KEYS = require('./keys.js');
const PORT = process.env.PORT || 5000;

require('mongoose').connect(KEYS.mongoURI);

const URL = require('./models/Url');

app.get('/new/:url(*)', async (req, res, next) => {
  const url = req.params.url;

  if (validUrl.isUri(url)) {
    // check if there is already a record of this url
    const dbEntry = await URL.findOne({ 'fullUrl': url });

    if (dbEntry) { // already have an entry
      res.send({ // send the user the existing alias for this url
        'original_url': dbEntry.fullUrl,
        'short_url': dbEntry.shortUrl
      });
    } else { // this is a new url
      let miniId;

      while (true) { // create a unique short url
        miniId = shortID.generate().slice(0, 4); // limit it to 4 characters

        const takenBy = await URL.findOne({ 'shortId': miniId });

        if (takenBy === null) { // if it's not taken, then go ahead and use it
          break;
        }
      }

      // save the url aliasing in the db
      const savedUrl = await (new URL({
        'fullUrl': url,
        'shortUrl': (KEYS.baseUrl + miniId),
        'shortId': miniId
      })).save();

      res.send({ // send the user the newly created url alias
        'original_url': savedUrl.fullUrl,
        'short_url': savedUrl.shortUrl
      });
    }

  } else { // not a valid url
    res.end(`ERROR! '${url}' is not a valid url!`);
  }
});

app.get('/:url', async (req, res, next) => {
  const url = req.params.url;

  const alias = await URL.findOne({ 'shortId': url });

  if (alias) {
    res.redirect(alias.fullUrl);
  } else {
    res.send('There is no url for that alias');
  }
});

app.get('/', (req, res, next) => {
  const htmlResponse = `<h1>url shortener microservice</h1>
<hr />
<br />
<p>To make a new alias, go to <a href="#">${KEYS.baseUrl}new/Original-Long-Url</a></p>
<p><strong>Note:</strong> The url you make an alias for must be valid and include the protocol (http/https)</p>
<br />
<h2>Example:</h2>
<p>To make an alias for <a href="https://www.google.com">https://www.google.com</a></p>
<p>Go to <a href="${KEYS.baseUrl}new/https://www.google.com">${KEYS.baseUrl}new/https://www.google.com</a></p>
`;

  res.send(htmlResponse);
});

app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
