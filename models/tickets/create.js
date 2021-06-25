'use strict';
const createChannel = require('../create-channel');
const getNickname = require('../get-nickname');
module.exports = async (client) => {
  const channelID = '857273061828067389';
  await client.channels.cache.get(channelID).messages.fetch();
  // console.log(message)
  client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.message.channel.id === channelID && !user.bot) {
      // console.log(`${user.username} reacted with "${reaction.emoji.name}".`);
      console.log(reaction.message);
      reaction.users.remove(user.id); 
      const nickname = await getNickname(client, user);
      let guild = await client.guilds.fetch('856596909023166535');
      createChannel(guild, `📗${nickname}📗`, '856836553623863307');
    }
  });
  // client.on('messageReactionRemove', (reaction, user) => {
  //   if(reaction.message.channel.id === channelID && !user.bot){
  //     console.log(`${user.username} removed their "${reaction.emoji.name}" reaction.`);
  //   }
  // });
};

