/* eslint-disable indent */
'use strict';

//------------------------------// Third Party Resources \\----------------------------\\
const Discord = require('discord.js');
const { MessageButton, MessageActionRow } = require('discord-buttons');
require('dotenv').config();

//---------------------------------// Import Resources \\-------------------------------\\
const createChannel = require('../create-channel');
const getNickname = require('../get-nickname');
const clickHandler = require('./click-handler');
const ticketMethods = require('./methods');
const { io } = require('../dashboard/index');
const methods = require('../dashboard/methods');

//--------------------------------// Esoteric Resources \\-------------------------------\\
const GUILD = process.env.GUILD;
// const CLOSED = process.env.CLOSED;
// const SAVED = process.env.SAVED;
const STUDENT_ROLE = process.env.STUDENT_ROLE;
const QUEUE = process.env.QUEUE;
const TA_ROLE = process.env.TA_ROLE;
const DEV_ROLE = process.env.DEV_ROLE;
const WAITING_ROOM = process.env.WAITING_ROOM;
const TICKETS_LOG = process.env.TICKETS_LOG;
const ticketsIDs = ['102', '201', '301', '401js', '401py', '401java', 'role'];

let close = new MessageButton()
  .setLabel('Close')
  .setEmoji('🔒')
  .setStyle('red')
  .setID('close');
let claim = new MessageButton()
  .setLabel('Claim')
  .setEmoji('📌')
  .setStyle('green')
  .setID('claim');
let unclaim = new MessageButton()
  .setLabel('Unclaim')
  .setEmoji('📌')
  .setStyle('gray')
  .setID('unclaim');
// let deleteBtn = new MessageButton()
//   .setLabel('Delete')
//   .setEmoji('🗑️')
//   .setStyle('red')
//   .setID('delete');
// let save = new MessageButton()
//   .setLabel('Save')
//   .setEmoji('💾')
//   .setStyle('blurple')
//   .setID('save');

let row1 = new MessageActionRow()
  .addComponent(close)
  .addComponent(claim);
let row2 = new MessageActionRow()
  .addComponent(close)
  .addComponent(unclaim);
// let row3 = new MessageActionRow()
//   .addComponent(deleteBtn)
//   .addComponent(save);

//---------------------------------// Bot Loading \\-------------------------------\\

module.exports = async (client) => {

  client.on('clickButton', async (button) => {
    await button.defer();

    if (ticketsIDs.includes(button.id)) {
      await button.clicker.fetch();
      const clickerRoles = button.clicker.member._roles;
      const nickname = await getNickname(client, button.clicker.user);
      const isDev = clickerRoles.includes(DEV_ROLE);

      if (clickerRoles.includes(TA_ROLE) && !isDev) {
        const embed = new Discord.MessageEmbed().setDescription(`TAs can't create tickets.`).setTitle('ASAC Tickets System').setColor('#ffc107');
        console.log(nickname, 'tried to create ticket');
        button.clicker.user.send(embed);
        return;
      }
      let check = await ticketMethods.checkTicket(button.clicker.user.id);

      if (check) {
        console.log(nickname, 'spam ticket');
        const embed = new Discord.MessageEmbed().setDescription(`You already have an open ticket.`).setTitle('ASAC Tickets System').setColor('#ffc107');
        button.clicker.user.send(embed);
        return;
      }

      let guild = await client.guilds.fetch(GUILD);
      const channel = await createChannel(guild, `${button.id}-${nickname}`, QUEUE, 'text', button.clicker.user.id);
      await ticketMethods.addTicket(button.clicker.user.id, channel.id, `${button.id}-${nickname}`);

      check = await ticketMethods.checkTicket2(button.clicker.user.id);

      if (check) {
        console.log(nickname, 'spam ticket');
        const embed = new Discord.MessageEmbed().setDescription(`You already have an open ticket.`).setTitle('ASAC Tickets System').setColor('#ffc107');
        button.clicker.user.send(embed);
        // ticketMethods.closeTicket(channel.id);
        ticketMethods.deleteTicket(channel.id);
        channel.delete();
        return;
      }
      // if (!result) {
      //   console.log('?');
      //   return;
      // }
      const embed = new Discord.MessageEmbed().setDescription(`Support will be with you shortly.`).setTitle('ASAC Tickets System').setFooter('by Abdulhakim Zatar').setColor('#b006c6');
      const embedDesc = new Discord.MessageEmbed().setDescription(`<@${button.clicker.user.id}> Kindly add a description of your issue here`).setColor('#ffc107');
      const embedMeeting = new Discord.MessageEmbed().setDescription(`<@${button.clicker.user.id}> Please note all TA are currently in a meeting, so expect to get help later than usual.
      
      We will get back to you as soon as possible.`).setColor('#ffc107');
      const embedTime = new Discord.MessageEmbed().setDescription(`<@${button.clicker.user.id}> You raised a ticket out of our working hours.
      
      You may not get the support fast.
      `).setColor('#ffc107');

      channel.send(`<@${button.clicker.user.id}> Welcome,

How can we help you?
Please write a description of your problem then do the following:
 - Go to "TEMPORARY CHANNELS" section.
 - Join ":hourglass:Waiting for Help:hourglass:".
 - Wait until one of the TAs move you to the breakout room.
      
One of our Teacher Assistants will join you as soon as possible.`, { embed, component: row1 });

      const time = new Date().getHours();
      setTimeout(async () => {
        channel.send(embedDesc);
        if (time > 16 || time < 9) {
          channel.send(embedTime);
        }
      }, 1000);

      // setTimeout(() => {
      //   channel.send(embedMeeting);
      // }, 5000);

      setTimeout(async () => {
        try {
          await guild.member(button.clicker.user.id).voice.setChannel(WAITING_ROOM);
        } catch (err) {
          const embed = new Discord.MessageEmbed().setDescription(`<@${button.clicker.user.id}> please join "⌛Waiting for Help⌛" channel`).setColor('#ffc107');
          await channel.send(embed);
        }
      }, 3000);


      const embedLog = new Discord.MessageEmbed()
        .addFields(
          { inline: false, name: 'Description', value: `🔨 <@${button.clicker.user.id}> created a ticket 🔨` },
          { inline: false, name: 'Ticket', value: `${button.id}-${nickname}` },

        )
        .setAuthor(button.clicker.user.username, button.clicker.user.avatarURL())
        .setColor('#008CBA')
        .setFooter('ASAC Bot - tickets');
      client.channels.fetch(TICKETS_LOG).then((channel) => {
        channel.send(embedLog);
      });
      // emit to dashboard
      io.emit('createTicket' , {totals : await methods.getTotals(client) , chart : await methods.getHours() ,dailyTicketsLevels : await methods.dailyTicketsLevels() ,dailyTicketsInfo : await methods.dailyTicketsInfo() , average : await methods.average()  });
      setTimeout(async () => {
        let noStudentMessages = true;
        try {
          const messages = await channel.messages.fetch({ limit: 100 });
          messages.forEach(message => {
            if (message.member.roles.cache.has(STUDENT_ROLE)) {
              noStudentMessages = false;
            }
          });
        } catch (err) {
          noStudentMessages = false;
        }
        // const isClaimed = await ticketMethods.isClaimed(button.channel.id);

        if (noStudentMessages) {
          await ticketMethods.closeTicket(channel.id);
          const embed = new Discord.MessageEmbed().setDescription(`<@${button.clicker.user.id}> ticket will close in 15 seconds because there is no description`).setColor('#f44336');
          await channel.send(embed);
          setTimeout(async () => {
            try {
              channel.delete();
            } catch (err) {
              console.log('already deleted', channel.name);
            }
          }, 15000);
        }
      }, (5000 * 60 * 1));
    }
    // Create ticket end ------------------------------------------------------------------------------------------------

    if (button.id === 'claim') {
      clickHandler(button, row2, button.id, client);
    }

    if (button.id === 'unclaim') {
      clickHandler(button, row1, button.id, client);
    }

    // if (button.id === 'delete') {
    //   clickHandler(button, null, button.id, client);
    // }

    if (button.id === 'close') {
      await button.clicker.fetch();
      const clickerRoles = button.clicker.member._roles;
      const isDev = clickerRoles.includes(DEV_ROLE);

      if (clickerRoles.includes(TA_ROLE) && !isDev) {
        let check = await ticketMethods.checkClaimer(button.clicker.user.id, button.channel.id);
        if (!check) {
          const embed = new Discord.MessageEmbed().setDescription(`You can't close the ticket, you are not the claimer of it.
          
          `).setTitle('ASAC Tickets System').setColor('#ffc107');
          console.log(button.clicker.user.username, 'tried to close ticket');
          button.clicker.user.send(embed);
          return;
        }
      }

      const oldEmbed = new Discord.MessageEmbed().setDescription(`Support will be with you shortly.`).setTitle('ASAC Tickets System').setFooter('by Abdulhakim Zatar').setColor('#b006c6');
      const embed = new Discord.MessageEmbed().setDescription(`Ticket closed by <@${button.clicker.user.id}>`).setColor('#f44336');

      button.message.edit(button.message.content, { oldEmbed, component: null });
      button.channel.send(embed);

      setTimeout(async () => {
        ticketMethods.closeTicket(button.channel.id);
        button.channel.delete();
        const embedLog = new Discord.MessageEmbed()
          .addFields(
            { inline: false, name: 'Description', value: `🔒 <@${button.clicker.user.id}> closed a ticket 🔒` },
            { inline: false, name: 'Ticket', value: button.channel.name },
          )

          .setAuthor(button.clicker.user.username, button.clicker.user.avatarURL())
          .setColor('#008CBA')
          .setFooter('ASAC Bot - tickets');
        client.channels.fetch('856858334439145492').then((channel) => {
          channel.send(embedLog);
        });
      }, 3000);
      io.emit('claimUnclaimCloseTicket',{  dailyTicketsInfo : await methods.dailyTicketsInfo() ,users :  await methods.getUsers(client) ,average :  await methods.average()});
    }
  });
};

//-----------------------------------------------------------------------------------------\\
