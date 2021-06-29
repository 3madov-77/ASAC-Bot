'use strict';

const points = require('../points');
const Discord = require('discord.js');

module.exports = {
  commands: ['all'],
  expectedArgs: '@user',
  permissionError: 'You need instructor/TA permissions to run this command',
  minArgs: 0,
  maxArgs: 0,
  callback: async (message, args, text) => {
    const all = await points.all();
    const embed1 = new Discord.MessageEmbed().setTitle('ASAC Points System').setDescription(`All users.`).setFooter('by Abdulhakim Zatar - page 1').setColor('#b006c6');
    const embed2 = new Discord.MessageEmbed().setTitle('ASAC Points System').setDescription(`All users.`).setFooter('by Abdulhakim Zatar - page 2').setColor('#b006c6');

    const embeds = [embed1, embed2];
    all.forEach((user, index) => {
      let i = 0;
      index < 25 ? i = 0 : i = 1;
      embeds[i].addField(`Rank: ${index + 1}`, `<@${user.id}> has ${user.points} points.`);
      // embed.addField();
    });
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;

    message.channel.send(today, { embed: embed1 });
    if(all.length>24){
      message.channel.send({ embed: embed2 });
    }
    message.delete();
  },
  permissions: [],
  requiredRoles: ['Instructor', 'Teacher Assistant'],
};