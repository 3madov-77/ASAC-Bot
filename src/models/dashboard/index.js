/* eslint-disable indent */
'use strict';

//------------------------------// Third Party Resources \\----------------------------\\
const Discord = require('discord.js');
require('dotenv').config();

//---------------------------------// Import Resources \\-------------------------------\\
const getNickname = require('../get-nickname');
const { Server } = require('socket.io');
const express = require('express');
const app = express();
const http = require('http');
const methods = require('./methods');

//--------------------------------// Esoteric Resources \\-------------------------------\\
const GUILD = process.env.GUILD;
const STUDENT_ROLE = process.env.STUDENT_ROLE;
const TA_ROLE = process.env.TA_ROLE;
const server = http.createServer(app);
const io = new Server(server);
//---------------------------------// Bot Loading \\-------------------------------\\

const startServer =  (client) => {
  app.get('/', (req, res) => {
    res.send('HELLO');
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
          
          io.emit('changeRole' , { total : await methods.getTotals(client) , users : await methods.getUsers(client)});
        }
      });

    } else if (oldMember.roles.cache.size < newMember.roles.cache.size) {
        
      newMember.roles.cache.forEach(async role => {
        if (!oldMember.roles.cache.has(role.id)) {
          console.log('added');
          io.emit('changeRole' , { total : await methods.getTotals(client) , users : await methods.getUsers(client)});
        }
      });
    }
  });

  client.on('voiceStateUpdate',async (oldMember, newMember)=>{
    const rooms = ['☕ Break ☕' , '🛑Currently not Available🛑']
    if (
      rooms.includes(newMember.channel.name)   || rooms.includes(oldMember.channel.name) 
    ) {
      io.emit('changeRoom' , {users : await methods.getUsers(client)});
    }
  });


};

module.exports = {startServer , io};
//-----------------------------------------------------------------------------------------\\
