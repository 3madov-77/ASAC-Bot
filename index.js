'use strict';

const Discord = require('discord.js');
require('dotenv').config();

const command = require('./models/command');
const createChannel = require('./models/create-channel');
const createPanel = require('./models/tickets/panel');
const createTicket = require('./models/tickets/create');

const token = process.env.TOKEN;
const client = new Discord.Client();
require('discord-buttons')(client);

client.on('ready', () => {

  console.log('ready');


  command(client, 'cc', (msg) => {
    createChannel(msg, 'test', '856960018239062076');
  });

  // createPanel(client);
  createTicket(client);

  client.user.setPresence({
    activity: {
      name: 'developed by Abdulhakim Zatar',
      type: 0,
    },
  });
});

client.login(token);