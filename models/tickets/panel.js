'use strict';
require('dotenv').config();
const { MessageButton } = require('discord-buttons');
const Discord = require('discord.js');
const TICKETS_ROOM = process.env.TICKETS_ROOM;


module.exports = async (client) => {
  const channelID = TICKETS_ROOM;
  const channel = await client.channels.fetch(channelID);
  const embed = new Discord.MessageEmbed().setDescription(`Need help?
  Click on one of the buttons below depending on your course.`).setTitle('ASAC Tickets System').setFooter('by Abdulhakim Zatar').setColor('#b006c6');

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


  await channel.send({ embed, buttons: [btn102, btn201, btn301] });
  await channel.send({ embed, buttons: [btn401js, btn401py, btn401java] });
  // addReaction(message, ['📩']);
};