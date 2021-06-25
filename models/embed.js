'use strict';
const Discord = require('discord.js');

module.exports = (channel,title) => {
  const Discord = require('discord.js');

  const embed = new Discord.MessageEmbed().setTitle(title).setFooter('by Abdulhakim Zatar').setColor('#b006c6').addField('Need help?','To create a ticket click on 📩');
  // .setTimestamp(Date.now())

  return channel.send(embed).then(msg => msg);
};