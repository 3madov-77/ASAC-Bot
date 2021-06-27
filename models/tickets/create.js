/* eslint-disable indent */
'use strict';
const fs = require('fs');

const Discord = require('discord.js');
const { MessageButton, MessageActionRow } = require('discord-buttons');
const createChannel = require('../create-channel');
const getNickname = require('../get-nickname');
const clickHandler = require('./click-handler');
require('dotenv').config();
// const TICKETS_ROOM = process.env.TICKETS_ROOM;
const GUILD = process.env.GUILD;
const CLOSED = process.env.CLOSED;
const SAVED = process.env.SAVED;
const QUEUE = process.env.QUEUE;
const ticketsIDs = ['102', '201', '301', '401js', '401py', '401java'];
const taRole = process.env.TA_ROLE;

let tickets = [];

module.exports = async (client) => {
  const getTickets = () => {
    tickets = JSON.parse(fs.readFileSync('createdTickets.json', 'utf-8'));
  };


  const updateTickets = (newTickets) => {
    newTickets = JSON.stringify(newTickets);
    fs.writeFileSync('createdTickets.json', newTickets, function (err) {
      console.log(err.message);
    });
  };

  const checkTicket = (userId) => {
    return tickets.includes(userId);
  };
  // const channelID = TICKETS_ROOM;
  // await client.channels.cache.get(channelID).messages.fetch();
  client.on('clickButton', async (button) => {
    getTickets();
    try {
      await button.defer();
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
      let deleteBtn = new MessageButton()
        .setLabel('Delete')
        .setEmoji('🗑️')
        .setStyle('red')
        .setID('delete');
      let save = new MessageButton()
        .setLabel('Save')
        .setEmoji('💾')
        .setStyle('blurple')
        .setID('save');

      let row1 = new MessageActionRow()
        .addComponent(close)
        .addComponent(claim);
      let row2 = new MessageActionRow()
        .addComponent(close)
        .addComponent(unclaim);
      let row3 = new MessageActionRow()
        .addComponent(deleteBtn)
        .addComponent(save);


      if (ticketsIDs.includes(button.id)) {
        await button.clicker.fetch();
        getTickets();
        const roles = button.clicker.member._roles;
        const nickname = await getNickname(client, button.clicker.user);
        if ((roles.includes(taRole))) {
          const embed = new Discord.MessageEmbed().setDescription(`TAs can't create tickets.`).setTitle('ASAC Tickets System').setColor('#ffc107');
          console.log(nickname, 'tried to create ticket');
          button.clicker.user.send(embed);
          return;
        }
        let guild = await client.guilds.fetch(GUILD);
        // await createChannel(guild, `📗test📗`, '856836553623863307');
        // console.log(checkTicket(button.clicker.user.id));
        if (checkTicket(button.clicker.user.id)) {
          console.log(nickname, 'spam ticket');
          const embed = new Discord.MessageEmbed().setDescription(`You have an opened ticket.`).setTitle('ASAC Tickets System').setColor('#ffc107');
          button.clicker.user.send(embed);
        } else {
          tickets.push(button.clicker.user.id);
          updateTickets(tickets);
        }

        const channel = await createChannel(guild, `${button.id}-${nickname}`, QUEUE, button.clicker.user.id);
        channel.updateOverwrite(button.clicker.user, {
          SEND_MESSAGES: true,
          VIEW_CHANNEL: true,
        });
        // console.log(channel);
        const embed = new Discord.MessageEmbed().setDescription(`Support will be with you shortly.`).setTitle('ASAC Tickets System').setFooter('by Abdulhakim Zatar').setColor('#b006c6');
        await channel.send(`<@${button.clicker.user.id}> Welcome,

How can we help you?
Please write a description of your problem then do the following:
 - Go to "TEMPORARY CHANNELS" section.
 - Join ":hourglass:Waiting for Help:hourglass:".
 - Wait until one of the TAs move you to the breakout room.
      
One of our <@&856605767583137793> will join you as soon as possible.`, { embed, component: row1 });
        // await button.clicker.fetch();
        // console.log(button.clicker);
        const embedLog = new Discord.MessageEmbed()
          .addFields(
            { inline: true, name: 'Description', value: `<@${button.clicker.user.id}> created a ticket` },
          )
          .setAuthor(button.clicker.user.username, button.clicker.user.avatarURL())
          .setColor('#008CBA')
          .setFooter('ASAC Bot - tickets');
        client.channels.fetch('856858334439145492').then((channel) => {
          channel.send(embedLog);
        });

        setTimeout(async () => {
          try {
            await guild.member(button.clicker.user.id).voice.setChannel('857169550625210378');
          } catch (err) {
            const embed = new Discord.MessageEmbed().setDescription(`<@${button.clicker.user.id}> please join "⌛Waiting for Help⌛" channel`).setColor('#ffc107');
            await channel.send(embed);
          }
        }, 3000);
      }

      if (button.id === 'claim') {
        clickHandler(button, row2, button.id, client);
      }

      if (button.id === 'unclaim') {
        clickHandler(button, row1, button.id, client);
      }

      if (button.id === 'delete') {
        clickHandler(button, null, button.id, client);
      }

      if (button.id === 'close') {
        await button.clicker.fetch();
        tickets = tickets.filter((userId) => {
          return userId != button.clicker.user.id;
        });
        updateTickets(tickets);
        const oldEmbed = new Discord.MessageEmbed().setDescription(`Support will be with you shortly.`).setTitle('ASAC Tickets System').setFooter('by Abdulhakim Zatar').setColor('#b006c6');
        button.message.edit(button.message.content, { oldEmbed, component: null });
        const embed = new Discord.MessageEmbed().setDescription(`Ticket closed by <@${button.clicker.user.id}>`).setColor('#f44336');
        await button.channel.send(embed);
        setTimeout(() => {
          button.channel.delete();
        }, 2000);

        // setTimeout(async () => {
        //   button.channel.setParent(CLOSED);
        //   setTimeout(async () => {
        //     const embed = new Discord.MessageEmbed().setDescription(`The ticket is closed, you can delete or save it`).setColor('#ffc107');
        //     await button.channel.send({ embed, component: row3 });

        //     const embedLog = new Discord.MessageEmbed()
        //       .addFields(
        //         { inline: true, name: 'Description', value: `<@${button.clicker.user.id}> closed a ticket` },
        //       )
        //       .setAuthor(button.clicker.user.username, button.clicker.user.avatarURL())
        //       .setColor('#008CBA')
        //       .setFooter('ASAC Bot - tickets');
        //     client.channels.fetch('856858334439145492').then((channel) => {
        //       channel.send(embedLog);
        //     });
        //   }, 1000);
        // }, 2000);
      }



      if (button.id === 'save') {
        button.channel.setParent(SAVED);
      }
    } catch (err) {
      // console.log(err.message);
    }
  });
  // TA_ROLE
};

