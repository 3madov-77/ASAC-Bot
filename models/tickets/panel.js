'use strict';
require('dotenv').config();
const TICKETS_ROOM = process.env.TICKETS_ROOM;
const embed = require('../embed');
const addReaction = require('../add-reaction');

module.exports = async (client) => {
  const channelID = TICKETS_ROOM;
  const channel = await client.channels.fetch(channelID);
  const {message} = await embed(channel, '201 - Level');

  addReaction(message, ['📩']);
};