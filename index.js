'use strict';

//------------------------------// Third Party Resources \\----------------------------\\
const Discord = require('discord.js');
const path = require('path');
const fs = require('fs');

require('dotenv').config();


//---------------------------------// Import Resources \\-------------------------------\\
const tickets = require('./src/models/tickets');
const roles = require('./src/models/roles');
const pg = require('./src/models/database');
const commandBase = require(`./src/models/commands/index.js`);
// const dashboard = require('./src/models/dashboard/methods');
const {startServer} = require('./src/models/dashboard');

//--------------------------------// Esoteric Resources \\-------------------------------\\
const token = process.env.TOKEN;
let intents = new Discord.Intents(Discord.Intents.NON_PRIVILEGED);
intents.add('GUILD_MEMBERS');
const client = new Discord.Client({ ws: {intents: intents} });
const baseFile = 'index.js';
require('discord-buttons')(client);

//---------------------------------// Bot Loading \\-------------------------------\\

client.on('ready', async () => {
  await pg.connect();
  // const Guild = client.guilds.cache.get('856596909023166535');
  // const Member = Guild.members.cache.get('223894785218445313');
  // console.log(Guild.member(Member.user).displayName);
  const readCommands = (dir) => {
    const files = fs.readdirSync(path.join(__dirname, dir));
    for (const file of files) {
      const stat = fs.lstatSync(path.join(__dirname, dir, file));
      if (stat.isDirectory()) {
        readCommands(path.join(dir, file));
      } else if (file !== baseFile) {
        const option = require(path.join(__dirname, dir, file));
        commandBase(client, option);
      }
    }
  };

  readCommands('src/models/commands');
  tickets(client);
  roles(client);
  startServer(client);
  // await dashboard.avgerage();
  // require(`./src/models/dashboard`)(client);
  client.user.setPresence({
    activity: {
      name: 'developed by Abdulhakim Zatar',
      type: 0,
    },
  });
});



client.login(token);
//-----------------------------------------------------------------------------------------\\
