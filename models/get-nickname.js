'use strict';

module.exports = async (client, user) => {
  let guild = await client.guilds.fetch('856596909023166535'); 
  if(!guild.member(user)) return user.username;
  else return guild.member(user).displayName;
};