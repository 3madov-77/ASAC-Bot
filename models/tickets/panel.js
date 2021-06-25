'use strict';
const embed = require('../embed');
const addReaction = require('../add-reaction');

module.exports = async (client) => {
  const channelID = '857273061828067389';
  const channel = await client.channels.fetch(channelID);
  const message = await embed(channel, '201 - Level');

  addReaction(message, ['📩']);
};