const urlExists = require('url-exists');

module.exports = (req, res, next) => {
  const url = req.params.url;

  urlExists(url, function (err, exists) {
    if (exists) {
      return next();
    }

    return res.json({ 'error': `'${url}' is not a valid url!` });
  });
}
