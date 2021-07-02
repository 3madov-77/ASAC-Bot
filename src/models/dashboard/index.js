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

//--------------------------------// Esoteric Resources \\-------------------------------\\
const GUILD = process.env.GUILD;
const STUDENT_ROLE = process.env.STUDENT_ROLE;
const TA_ROLE = process.env.TA_ROLE;
const server = http.createServer(app);
const io = new Server(server);
//---------------------------------// Bot Loading \\-------------------------------\\

module.exports = async (client) => {
  app.get('/', (req, res) => {
    res.send('HELLO');
  });
  server.listen(process.env.PORT || 3030, () => {
    console.log('listening on *:3030');
  });

  io.on('connection', (socket) => {
    console.log(socket.id);
    // console.log('===================');
    // socket.on('test',(payload)=>{
    //   console.log(payload);
    // });
  });

};

//-----------------------------------------------------------------------------------------\\
