/* eslint-disable indent */
'use strict';

//------------------------------// Third Party Resources \\----------------------------\\
const Discord = require('discord.js');
require('dotenv').config();

//---------------------------------// Import Resources \\-------------------------------\\
const socketIo = require('socket.io');
const express = require('express');
const app = express();
const http = require('http');
const methods = require('./methods');
const cors = require('cors');
const nickname = require('../get-nickname');
const createChannel = require('../create-channel');


//--------------------------------// Esoteric Resources \\-------------------------------\\
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});
app.use(cors());
app.use(express.json());
let createRooms = [];
//---------------------------------// Bot Loading \\-------------------------------\\

const startServer = (client) => {

  app.get('/all', async (req, res) => {
    res.json({ chart: await methods.getHours(), total: await methods.getTotals(client), users: await methods.getUsers(client), dailyTicketsInfo: await methods.dailyTicketsInfo(), average: await methods.average(), dailyTicketsLevels: await methods.dailyTicketsLevels() });
  });
  server.listen(process.env.PORT || 3030, () => {
    console.log('listening on *:3030');
  });

  client.on('guildMemberUpdate', (oldMember, newMember) => {
    if (oldMember.roles.cache.size > newMember.roles.cache.size) {

      oldMember.roles.cache.forEach(async role => {
        if (!newMember.roles.cache.has(role.id)) {
          console.log('removed');
          // methods

          io.emit('changeRole', { total: await methods.getTotals(client), users: await methods.getUsers(client) });
        }
      });

    } else if (oldMember.roles.cache.size < newMember.roles.cache.size) {

      newMember.roles.cache.forEach(async role => {
        if (!oldMember.roles.cache.has(role.id)) {
          console.log('added');
          io.emit('changeRole', { total: await methods.getTotals(client), users: await methods.getUsers(client) });
        }
      });
    }
  });

  client.on('voiceStateUpdate', async (oldMember, newMember) => {
    const rooms = ['857312945339891712', '859032754531598356'];
    const createRoom = '861654384097361960';
    if (newMember.channelID == createRoom) {
      const member = newMember.guild.members.cache.find(user => user.id === newMember.id);
      const name = await nickname(client, member.user);
      // const name = 'test';
      const channel = await createChannel(newMember.guild, `${name}'s room`, '856769627480915998', 'voice', newMember.id);
      createRooms.push(channel.id);
      member.voice.setChannel(channel);
    }
    if (createRooms.includes(oldMember.channelID) && newMember.guild.channels.cache.get(oldMember.channelID).members.size === 0) {
      oldMember.channel.delete();
      createRooms = createRooms.filter((room) => room != oldMember.channelID);
    }
    if (
      rooms.includes(newMember.channelID) || rooms.includes(oldMember.channelID)
    ) {
      io.emit('changeRoom', { users: await methods.getUsers(client) });
    }
  });


};

module.exports = { startServer, io };
//-----------------------------------------------------------------------------------------\\
