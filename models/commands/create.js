'use strict';

const points = require('../points');
const Discord = require('discord.js');

module.exports = {
  commands: ['c', 'create'],
  expectedArgs: 'cohortName @TA-Name @TA-Name ...',
  permissionError: 'You need instructor permissions to run this command',
  minArgs: 2,
  maxArgs: 10,
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

    const TAs = [];

    for (let index = 1; index < args.length; index++) {
      const id = args[index].slice(3, args[index].length - 1);
      const member = guild.members.cache.find(user => user.id === id);
      member.roles.add(newRole);
      TAs.push(id);
      embed.addField(`Add Role to <@id>`, 'Done ✅');
    }

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

    const teamTextChannel = await guild.channels.create('team', {
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

    const teamVoiceChannel = await guild.channels.create(`team`, {
      type: 'voice', parent: category.id, permissionOverwrites: [
        {
          id: message.guild.id,
          deny: ['VIEW_CHANNEL'],
        }, {
          id: message.member.id,
          allow: ['VIEW_CHANNEL'],
        }],
    });

    for (let index = 0; index < TAs.length; index++) {
      teamTextChannel.updateOverwrite(TAs[index], {
        VIEW_CHANNEL: true,
      });
      teamVoiceChannel.updateOverwrite(TAs[index], {
        VIEW_CHANNEL: true,
      });
    }

    await guild.channels.create(`General`, {
      type: 'voice', parent: category.id, permissionOverwrites: [
        {
          id: message.guild.id,
          deny: ['VIEW_CHANNEL'],
        }, {
          id: newRole.id,
          allow: ['VIEW_CHANNEL'],
        }],
    });

    for (let index = 1; index <= 15; index++) {
      guild.channels.create(`Table-${index}`, {
        type: 'voice', userLimit: index <= 5 ? 10 : index <= 10 ? 5 : 2, parent: category.id, permissionOverwrites: [
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

    const channel = await client.channels.fetch(`858395637133213696`);

    channel.updateOverwrite(newRole.id, {
      VIEW_CHANNEL: false,
    });

    message.reply(embed);
    message.delete();
  },

  permissions: [],
  requiredRoles: ['Instructor', 'Dev'],
};