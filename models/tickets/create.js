'use strict';
const createChannel = require('../create-channel');
const getNickname = require('../get-nickname');
require('dotenv').config();
const TICKETS_ROOM = process.env.TICKETS_ROOM;
const GUILD = process.env.GUILD;

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
      await createChannel(guild, `📗${level}-${nickname}📗`, '856836553623863307');
    }
  });
  // client.on('messageReactionRemove', (reaction, user) => {
  //   if(reaction.message.channel.id === channelID && !user.bot){
  //     console.log(`${user.username} removed their "${reaction.emoji.name}" reaction.`);
  //   }
  // });
};

