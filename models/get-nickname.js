'use strict';

module.exports = async (client, user) => {
  let guild = await client.guilds.fetch('856596909023166535');
  return guild.member(user).displayName;
};