'use strict';

//------------------------------// Third Party Resources \\----------------------------\\
const Discord = require('discord.js');
require('dotenv').config();

//---------------------------------// Import Resources \\-------------------------------\\
const points = require('../points');
const ticketMethods = require('./methods');

//--------------------------------// Esoteric Resources \\-------------------------------\\
const taRole = process.env.TA_ROLE;
const instRole = process.env.INST_ROLE;
const QUEUE = process.env.QUEUE;
const CLAIMED = process.env.CLAIMED;
const DEV_ROLE = process.env.DEV_ROLE;
const TICKETS_LOG = process.env.TICKETS_LOG;
const STUDENT_ROLE = process.env.STUDENT_ROLE;

//---------------------------------// Bot Loading \\-------------------------------\\

const claimingMessage = async (button, row, type) => {
  const embedClaim = new Discord.MessageEmbed().setDescription(`Ticket ${type}ed by <@${button.clicker.user.id}>`).setColor(type === 'claim' ? '#4CAF50' : '#f44336');
  button.channel.send(embedClaim);
  const embed = new Discord.MessageEmbed().setDescription(`Support will be with you shortly.
  To close this ticket click on 🔒`).setTitle('ASAC Tickets System').setFooter('by Abdulhakim Zatar').setColor('#b006c6');
  await button.message.edit(button.message.content, { embed, component: row });
};

const unsupport = async (button) => {
  const notSupport = new Discord.MessageEmbed().setDescription(`You can't claim/unclaim the ticket <@${button.clicker.user.id}>`).setColor('#f44336');
  button.channel.send(notSupport);
  return;
};

module.exports = async (button, row, type, client) => {
  await Promise.all([button.clicker.fetch(), button.channel.fetch()]);
  const roles = button.clicker.member._roles;

  if ((!roles.includes(taRole) && !roles.includes(instRole))) {
    unsupport(button);
    return;
  }

  // if (type === 'delete') {
  //   button.channel.delete();
  //   const embedLog = new Discord.MessageEmbed()
  //     .addFields(
  //       { inline: true, name: 'Description', value: `<@${button.clicker.user.id}> deleted a ticket` },
  //     )
  //     .setAuthor(button.clicker.user.username, button.clicker.user.avatarURL())
  //     .setColor('#008CBA')
  //     .setFooter('ASAC Bot - tickets');
  //   client.channels.fetch('856858334439145492').then((channel) => {
  //     channel.send(embedLog);
  //   });
  // }
  const isClaimed = await ticketMethods.isClaimed(button.channel.id);

  if (type === 'claim' && !isClaimed) {

    const messages = await button.channel.messages.fetch({ limit: 100 });
    let noStudentMessages = true;
    messages.forEach(message => {
      if (message.member.roles.cache.has(STUDENT_ROLE)) {
        noStudentMessages = false;
      }
    });

    if (noStudentMessages) {
      const embed = new Discord.MessageEmbed().setDescription(`You can't claim the ticket because there is no description from the student`).setTitle('ASAC Tickets System').setColor('#ffc107');
      button.clicker.user.send(embed);
      return;
    }

    const permissions = button.channel.permissionOverwrites;

    const haveTicket = ticketMethods.haveTicket(button.clicker.user.id);
    if (haveTicket) {
      const embed = new Discord.MessageEmbed().setDescription(`You have another claimed ticket.`).setTitle('ASAC Tickets System').setColor('#ffc107');
      button.clicker.user.send(embed);
      return;
    }
    await ticketMethods.claimTicket(button.clicker.user.id, button.channel.id);

    claimingMessage(button, row, type);
    points.addPoint(button.clicker.user.id);

    setTimeout(() => {
      button.channel.setParent(CLAIMED);
      button.channel.overwritePermissions(permissions);

      const embedLog = new Discord.MessageEmbed()
        .addFields(
          { inline: false, name: 'Description', value: `📌 <@${button.clicker.user.id}> claimed a ticket 📌` },
          { inline: false, name: 'Ticket', value: button.channel.name },

        )
        .setAuthor(button.clicker.user.username, button.clicker.user.avatarURL())
        .setColor('#008CBA')
        .setFooter('ASAC Bot - tickets');
      client.channels.fetch(TICKETS_LOG).then((channel) => {
        channel.send(embedLog);
      });
    }, 500);

  }

  if (type === 'unclaim' && isClaimed) {

    const check = await ticketMethods.checkClaimer(button.clicker.user.id, button.channel.id);
    const roles = button.clicker.member._roles;
    const isDev = roles.includes(DEV_ROLE);

    if (!check && !isDev) {
      const embed = new Discord.MessageEmbed().setDescription(`You can't claim a claimed ticket,
      
      please tag the dev role in the ticket if you need it to be unclaimed.
      `).setTitle('ASAC Tickets System').setColor('#ffc107');
      button.clicker.user.send(embed);
      return;
    }

    const permissions = button.channel.permissionOverwrites;
    await ticketMethods.unClaimTicket(button.channel.id);
    claimingMessage(button, row, type);
    points.removePoint(button.clicker.user.id);

    setTimeout(() => {
      button.channel.setParent(QUEUE);
      button.channel.overwritePermissions(permissions);
      const embedLog = new Discord.MessageEmbed()
        .addFields(
          { inline: false, name: 'Description', value: `😢 <@${button.clicker.user.id}> unclaimed a ticket 😢` },
          { inline: false, name: 'Ticket', value: button.channel.name },
        )
        .setAuthor(button.clicker.user.username, button.clicker.user.avatarURL())
        .setColor('#008CBA')
        .setFooter('ASAC Bot - tickets');
      client.channels.fetch(TICKETS_LOG).then((channel) => {
        channel.send(embedLog);
      });
    }, 500);
  }
};
//-----------------------------------------------------------------------------------------\\
