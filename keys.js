
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config(); // set up local environment variables for development
}

module.exports = {
  'mongoURI': `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`,
  'baseUrl': process.env.BASE_URL
}
