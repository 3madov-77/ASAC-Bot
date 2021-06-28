'use strict';

//------------------------------// Third Party Resources \\----------------------------\\
require('dotenv').config();

//--------------------------------// Esoteric Resources \\-------------------------------\\
const GUILD = process.env.GUILD;

//---------------------------------// Bot Loading \\-------------------------------\\

module.exports = async (client, user) => {
  let guild = await client.guilds.fetch(GUILD);
  if (!guild.member(user)) return user.username;
  else return guild.member(user).displayName;
};

//-----------------------------------------------------------------------------------------\\
