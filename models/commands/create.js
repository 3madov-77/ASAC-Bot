'use strict';

const points = require('../points');
const Discord = require('discord.js');

module.exports = {
  commands: ['c', 'create'],
  expectedArgs: 'cohortName',
  permissionError: 'You need instructor permissions to run this command',
  minArgs: 1,
  maxArgs: 1,
  callback: async (message, args, text, client) => {
    const guild = message.guild;
    const cohort = args[0];
    const newRole = await guild.roles.create({
      data: {
        name: cohort,
        color: 'BLUE',
      },
    });

    const embed = new Discord.MessageEmbed().setTitle('ASAC Cohorts System').setFooter('by Abdulhakim Zatar').setColor('#b006c6');
    embed.addField('Create Role', 'Done ✅');

    message.member.roles.add(newRole);
    embed.addField('Add Role to you', 'Done ✅');

    const category = await guild.channels.create(cohort, {
      type: 'category', permissionOverwrites: [
        {
          id: message.guild.id,
          deny: ['VIEW_CHANNEL'],
        }, {
          id: newRole.id,
          allow: ['VIEW_CHANNEL'],
        }],
    });
    embed.addField('Create Category', 'Done ✅');


    await guild.channels.create('general', {
      type: 'text', parent: category.id, permissionOverwrites: [
        {
          id: message.guild.id,
          deny: ['VIEW_CHANNEL'],
        }, {
          id: newRole.id,
          allow: ['VIEW_CHANNEL'],
        }],
    });
    await guild.channels.create('team', {
      type: 'text', parent: category.id, permissionOverwrites: [
        {
          id: message.guild.id,
          deny: ['VIEW_CHANNEL'],
        }, {
          id: message.member.id,
          allow: ['VIEW_CHANNEL'],
        }],
    });
    embed.addField('Create Text Channels', 'Done ✅');

    guild.channels.create(`team`, {
      type: 'voice', parent: category.id, permissionOverwrites: [
        {
          id: message.guild.id,
          deny: ['VIEW_CHANNEL'],
        }, {
          id: message.member.id,
          allow: ['VIEW_CHANNEL'],
        }],
    });

    for (let index = 1; index <= 10; index++) {
      guild.channels.create(`Table-${index}`, {
        type: 'voice',userLimit:5, parent: category.id, permissionOverwrites: [
          {
            id: message.guild.id,
            deny: ['VIEW_CHANNEL'],
          }, {
            id: newRole.id,
            allow: ['VIEW_CHANNEL'],
          }],
      });
    }
    guild.channels.create(`☕Coffee-Table☕`, {
      type: 'voice', parent: category.id, permissionOverwrites: [
        {
          id: message.guild.id,
          deny: ['VIEW_CHANNEL'],
        }, {
          id: newRole.id,
          allow: ['VIEW_CHANNEL'],
        }],
    });
    guild.channels.create(`🎤No-Mic🎤`, {
      type: 'voice', parent: category.id, permissionOverwrites: [
        {
          id: message.guild.id,
          deny: ['VIEW_CHANNEL', 'SPEAK'],
        }, {
          id: newRole.id,
          allow: ['VIEW_CHANNEL'],
        }],
    });
    embed.addField('Create Voice Channels', 'Done ✅');



    message.reply(embed);
    message.delete();
  },

  permissions: [],
  requiredRoles: ['Instructor', 'Dev'],
};