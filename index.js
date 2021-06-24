'use strict';

const Discord = require('discord.js');
require('dotenv').config();

const command = require('./models/command');

const token = process.env.TOKEN;
const client = new Discord.Client();

client.on('ready', () => {
  console.log('ready');

  command(client, 'ping', (msg) => {
    msg.channel.send('Pong');
  });
  
  client.user.setPresence({
    activity: {
      name: 'developed by Abduhalkim Zatar',
      type: 0,
    },
  });
});

client.login(token);