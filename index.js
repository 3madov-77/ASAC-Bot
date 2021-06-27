'use strict';

const Discord = require('discord.js');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

// const command = require('./models/command');
// const createChannel = require('./models/create-channel');
// const createPanel = require('./models/tickets/panel');
const createTicket = require('./models/tickets/create');
const roles = require('./models/roles/click-handler');
const mongo = require('./models/database');

const token = process.env.TOKEN;
const client = new Discord.Client();
require('discord-buttons')(client);

client.on('ready', async () => {

  console.log('ready');
  await mongo();

  const baseFile = 'index.js';
  const commandBase = require(`./models/commands/${baseFile}`);

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

  readCommands('models/commands');

  // createPanel(client);
  createTicket(client);
  roles(client);

  client.user.setPresence({
    activity: {
      name: 'developed by Abdulhakim Zatar',
      type: 0,
    },
  });
});

client.login(token);