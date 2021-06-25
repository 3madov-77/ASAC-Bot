'use strict';
const createChannel = require('../create-channel');
const getNickname = require('../get-nickname');
const addReaction = require('../add-reaction');
require('dotenv').config();
const TICKETS_ROOM = process.env.TICKETS_ROOM;
const GUILD = process.env.GUILD;
const TA_ROLE = process.env.TA_ROLE;

module.exports = async (client) => {
  const channelID = TICKETS_ROOM;
  await client.channels.cache.get(channelID).messages.fetch();
  // console.log(message)
  client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.message.channel.id === channelID && !user.bot) {
      // console.log(`${user.username} reacted with "${reaction.emoji.name}".`);
      const level = reaction.message.embeds[0].title.split(' ')[0];
      reaction.users.remove(user.id);
      const nickname = await getNickname(client, user);
      let guild = await client.guilds.fetch(GUILD);
      const channel = await createChannel(guild, `📗${level}-${nickname}📗`, '856836553623863307');
      // console.log(channel);
      const message = await channel.send(`<@${user.id}> Welcome,

      How can we help you?
      Please write a description of your problem then do the following:
      - Go to "TEMPORARY CHANNELS" section.
      - Join ":hourglass:Waiting for Help:hourglass:".
      - Wait until one of the TAs move you to the breakout room.
      
      
      One of our TAs will join you as soon as possible.`);
      addReaction(message, ['📩']);

    }
  });
  // TA_ROLE
};

