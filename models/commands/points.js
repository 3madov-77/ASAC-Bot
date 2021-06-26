'use strict';

const points = require('../points');
const Discord = require('discord.js');

module.exports = {
  commands: ['p', 'points'],
  expectedArgs: '<@user>',
  permissionError: 'You need instructor permissions to run this command',
  minArgs: 1,
  maxArgs: 1,
  callback: async (message, args, text) => {
    const id = args[0].slice(3, args[0].length - 1);
    const userPoints = await points.getPoints(id);
    const embed = new Discord.MessageEmbed().setTitle('ASAC Points System').setDescription(`<@${id}> has ${userPoints} points.`).setFooter('by Abdulhakim Zatar').setColor('#b006c6');

    message.reply(``, embed);
    setTimeout(() => {
      message.delete();
    }, 3000);
  },
  permissions: [],
  requiredRoles: ['Instructor', 'Dev'],
};