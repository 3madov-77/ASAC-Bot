const mongoose = require('mongoose');
require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI;

module.exports = async () => {
  await mongoose.connect(MONGODB_URI, {
    keepAlive: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return mongoose;
};