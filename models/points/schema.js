'use strict';
const mongoose = require('mongoose');

module.exports = mongoose.model('point', mongoose.Schema({
  userId: { type: String, required: true },
  points: { type: Number, default: 0 },
  last: { type: Date, default: Date.now },
}),
);
