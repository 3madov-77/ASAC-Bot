'use strict';
const mongo = require('./schema.js');
class Points{
  async getPoints(id){
    const points = await mongo.find({userId:id});
    return points[0]; 
  }

  async addPoints(id){

  }

  async removePoints(id){

  }

  async topPoints(){

  }

  async all(){

  }
}

module.exports = new Points();