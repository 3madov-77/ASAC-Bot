'use strict';

//------------------------------// Third Party Resources \\----------------------------\\
const Discord = require('discord.js');
require('dotenv').config();

//--------------------------------// Esoteric Resources \\-------------------------------\\
const activeCourses = ['401-js-d08', '401-js-d09', '401-js-d10', '401-py-d03', '401-py-d04', '401-java-d02', '301-d22', '301-d23', '301-d24', '301-d25', '201-d28', '201-d31', '201-d32', '201-d33', '102-d36'];
const ROLES_LOG = process.env.ROLES_LOG;

//---------------------------------// Bot Loading \\-------------------------------\\

module.exports = async (client) => {

  client.on('clickButton', async (button) => {
    if (activeCourses.includes(button.id)) {

      await button.clicker.fetch();
      const role = button.message.guild.roles.cache.find((role) => role.name === button.id);
      button.clicker.member.roles.add(role);

      const embed = new Discord.MessageEmbed().setDescription(`You are now assigned to **${role.name}**.
        
        If it's not your course, create a "change course" ticket.
        `).setTitle('ASAC Roles System').setColor('#ffc107');

      button.clicker.user.send(embed);

      const embedLog = new Discord.MessageEmbed()
        .addFields(
          { inline: true, name: 'Description', value: `<@${button.clicker.user.id}> picked <@&${role.id}>` },
        )
        .setAuthor(button.clicker.user.username, button.clicker.user.avatarURL())
        .setColor('#008CBA')
        .setFooter('ASAC Bot - roles');
      client.channels.fetch(ROLES_LOG).then((channel) => {
        channel.send(embedLog);
      });

    }
  });
};
//-----------------------------------------------------------------------------------------\\
