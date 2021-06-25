'use strict';

const Discord = require('discord.js');
require('dotenv').config();

const command = require('./models/command');
const createChannel = require('./models/create-channel');
const embed = require('./models/embed');
const createPanel = require('./models/tickets/panel');
const createTicket = require('./models/tickets/create');

const token = process.env.TOKEN;
const client = new Discord.Client();

client.on('ready', () => {

  console.log('ready');


  command(client, 'cc', (msg) => {
    createChannel(msg, 'test', '856960018239062076');
  });

  command(client, 'embed', (msg) => {
    embed(msg);
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