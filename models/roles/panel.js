'use strict';
require('dotenv').config();
const { MessageButton } = require('discord-buttons');
const Discord = require('discord.js');
const ROLES_ROOM = process.env.ROLES_ROOM;


module.exports = async (client) => {
  const channelID = ROLES_ROOM;
  const channel = await client.channels.fetch(channelID);

  const embed = new Discord.MessageEmbed().setDescription(`Please select the course you are currently in.
  
  for exmaple I'm in amman-js-401d10, I will click on amman-js-401d10 button
  `).setTitle('ASAC Roles System').setFooter(`by Abdulhakim Zatar & Sa'ed Al-Khateeb`).setColor('#b006c6');

  let btn401d08js = new MessageButton()
    .setLabel('amman-js-401d08')
    .setStyle('blurple')
    .setID('401-js-d08');

  let btn401d09js = new MessageButton()
    .setLabel('amman-js-401d09')
    .setStyle('blurple')
    .setID('401-js-d09');

  let btn401d10js = new MessageButton()
    .setLabel('amman-js-401d10')
    .setStyle('blurple')
    .setID('401-js-d10');

  let btn401d03py = new MessageButton()
    .setLabel('amman-py-401d03')
    .setStyle('blurple')
    .setID('401-py-d03');

  let btn401d04py = new MessageButton()
    .setLabel('amman-py-401d04')
    .setStyle('blurple')
    .setID('401-py-d04');

  let btn401d02java = new MessageButton()
    .setLabel('amman-java-401d02')
    .setStyle('blurple')
    .setID('401-java-d02');

  let btn301d22 = new MessageButton()
    .setLabel('amman-301d22')
    .setStyle('blurple')
    .setID('301-d22');

  let btn301d23 = new MessageButton()
    .setLabel('amman-301d23')
    .setStyle('blurple')
    .setID('301-d23');

  let btn301d24 = new MessageButton()
    .setLabel('amman-301d24')
    .setStyle('blurple')
    .setID('301-d24');

  let btn301d25 = new MessageButton()
    .setLabel('amman-301d25')
    .setStyle('blurple')
    .setID('301-d25');

  let btn201d28 = new MessageButton()
    .setLabel('amman-201d28')
    .setStyle('blurple')
    .setID('201-d28');

  let btn201d31 = new MessageButton()
    .setLabel('amman-201d31')
    .setStyle('blurple')
    .setID('201-d31');

  let btn201d32 = new MessageButton()
    .setLabel('amman-201d32')
    .setStyle('blurple')
    .setID('201-d32');

  let btn102d36 = new MessageButton()
    .setLabel('amman-102d36')
    .setStyle('blurple')
    .setID('102-d36');

  await channel.send({ embed, buttons: [btn102d36, btn201d28, btn201d31, btn201d32] });
  await channel.send({ embed, buttons: [btn301d22, btn301d23, btn301d24, btn301d25, btn401d02java] });
  await channel.send({ embed, buttons: [btn401d08js, btn401d09js, btn401d10js, btn401d03py, btn401d04py] });
  // addReaction(message, ['📩']);
};