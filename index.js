'use strict';

const Discord = require('discord.js');
require('dotenv').config();

const token = process.env.TOKEN;
const client = new Discord.Client();

client.on('ready',()=>{
  console.log('ready');
});

client.login(token);