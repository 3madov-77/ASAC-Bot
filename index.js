'use strict';

const Discord = require('discord.js');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

// const command = require('./models/command');
// const createChannel = require('./models/create-channel');
const createPanel = require('./models/tickets/panel');
// const createTicket = require('./models/tickets/create');
const mongo = require('./models/database');

const token = process.env.TOKEN;
const client = new Discord.Client();
require('discord-buttons')(client);

client.on('ready', async () => {

  console.log('ready');
  await mongo();
  // console.log(await points.all('223894785218445314'));
  // command(client, 'cc', (msg) => {
  //   createChannel(msg, 'test', '856960018239062076');
  // });

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

  createPanel(client);
  // createTicket(client);

  client.user.setPresence({
    activity: {
      name: 'developed by Abdulhakim Zatar',
      type: 0,
    },
  });
});

client.login(token);