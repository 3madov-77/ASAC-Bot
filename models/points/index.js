'use strict';
const mongo = require('./schema.js');
class Points {
  async getPoints(userId) {
    let result = await mongo.findOne({ userId });

    if (result) {
      return result.points;
    } else {
      await new mongo({ userId }).save();
      return 0;
    }
  }

  async addPoint(userId) {
    return await mongo.findOneAndUpdate({ userId }, {
      userId,
      $inc: {
        points: 1,
      },
      last: Date.now(),
    }, { upsert: true, new: true });
  }

  async removePoint(userId) {
    return await mongo.findOneAndUpdate({ userId }, {
      userId,
      $inc: {
        points: -1,
      },
      last: Date.now(),
    }, { upsert: true, new: true });
  }

  async topPoints() {
    return await mongo.find({}).sort({ points: -1 }).limit(10);
  }

  async all() {
    return await mongo.find({}).sort({ points: -1 });
  }
}

module.exports = new Points();