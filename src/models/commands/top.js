'use strict';

const points = require('../points');
const Discord = require('discord.js');

module.exports = {
  commands: ['t', 'top'],
  expectedArgs: '@user',
  permissionError: 'You need instructor/TA permissions to run this command',
  minArgs: 0,
  maxArgs: 0,
  callback: async (message, args, text) => {
    const top = await points.topPoints();
    const embed = new Discord.MessageEmbed().setTitle('ASAC Points System').setDescription(`Top 10 users.`).setFooter('by Abdulhakim Zatar').setColor('#b006c6');
    top.forEach((user, index) => {
      embed.addField(`Rank: ${index + 1}`, `<@${user.id}> has ${user.points} points.`);
      // embed.addField();
    });
    message.reply('',{embed});
    message.delete();
  },
  permissions: [],
  requiredRoles: ['Instructor', 'Teacher Assistant'],
};