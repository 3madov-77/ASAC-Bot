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


//--------------------------------// Esoteric Resources \\-------------------------------\\
const server = http.createServer(app);
const io = socketIo(server , {
  cors: {
    origin: '*',
  },
});
app.use(cors());
app.use(express.json());

//---------------------------------// Bot Loading \\-------------------------------\\

const startServer = (client) => {
  
  app.get('/all', async (req, res) => {
    res.json({ total: await methods.getTotals(client), users: await methods.getUsers(client), dailyTicketsInfo: await methods.dailyTicketsInfo(), average: await methods.average(), dailyTicketsLevels: await methods.dailyTicketsLevels() });
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
    const rooms = ['☕ Break ☕', '🛑Currently not Available🛑'];
    if (newMember.channel || oldMember.channel) {

      if (
        rooms.includes(newMember.channel.name) || rooms.includes(oldMember.channel.name)
      ) {
        io.emit('changeRoom', { users: await methods.getUsers(client) });
      }
    }
  });


};

module.exports = { startServer, io };
//-----------------------------------------------------------------------------------------\\
