'use strict';

//------------------------------// Third Party Resources \\----------------------------\\
require('dotenv').config();
const { MessageButton } = require('discord-buttons');
const Discord = require('discord.js');


//--------------------------------// Esoteric Resources \\-------------------------------\\
const TICKETS_ROOM = process.env.TICKETS_ROOM;

//---------------------------------// Tickets Panel \\-------------------------------\\

module.exports = async (client) => {
  const channel = await client.channels.fetch(TICKETS_ROOM);
  const embed = new Discord.MessageEmbed().setDescription(`Have you picked the **wronge course**?
  Click on the button below to create a ticket.`).setTitle('ASAC Tickets System').setFooter('by Abdulhakim Zatar').setColor('#ffc107');

  let btn102 = new MessageButton()
    .setLabel('102 - Level')
    .setStyle('blurple')
    .setID('102');

  let btn201 = new MessageButton()
    .setLabel('201 - Level')
    .setStyle('blurple')
    .setID('201');

  let btn301 = new MessageButton()
    .setLabel('301 - Level')
    .setStyle('blurple')
    .setID('301');

  let btn401js = new MessageButton()
    .setLabel('401 - JavaScript - Level')
    .setStyle('blurple')
    .setID('401js');

  let btn401py = new MessageButton()
    .setLabel('401 - Python - Level')
    .setStyle('blurple')
    .setID('401py');

  let btn401java = new MessageButton()
    .setLabel('401 - Java - Level')
    .setStyle('blurple')
    .setID('401java');

  let btnRole = new MessageButton()
    .setLabel('Change Course')
    .setStyle('red')
    .setID('role');


  await channel.send({ embed, buttons: [btn102, btn201, btn301] });
  await channel.send({ embed, buttons: [btn401js, btn401py, btn401java] });
  await channel.send({ embed, buttons: [btnRole] });
};
//-----------------------------------------------------------------------------------------\\
