/* eslint-disable indent */
'use strict';

const Discord = require('discord.js');
const { MessageButton, MessageActionRow } = require('discord-buttons');
const createChannel = require('../create-channel');
const getNickname = require('../get-nickname');
const clickHandler = require('./click-handler');
require('dotenv').config();
// const TICKETS_ROOM = process.env.TICKETS_ROOM;
const GUILD = process.env.GUILD;
const TA_ROLE = process.env.TA_ROLE;
const CLOSED = process.env.CLOSED;
const QUEUE = process.env.QUEUE;
const ticketsIDs = ['201', '301', '401js', '401py', '401java'];


module.exports = async (client) => {
  // const channelID = TICKETS_ROOM;
  // await client.channels.cache.get(channelID).messages.fetch();
  client.on('clickButton', async (button) => {

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

      let row1 = new MessageActionRow()
        .addComponent(close)
        .addComponent(claim);
      let row2 = new MessageActionRow()
        .addComponent(close)
        .addComponent(unclaim);



      if (ticketsIDs.includes(button.id)) {
        await button.clicker.fetch();
        const nickname = await getNickname(client, button.clicker.user);
        let guild = await client.guilds.fetch(GUILD);
        // await createChannel(guild, `📗test📗`, '856836553623863307');
        const channel = await createChannel(guild, `📗${button.id}-${nickname}📗`, QUEUE, button.clicker.user.id);
        channel.updateOverwrite(button.clicker.user, {
          SEND_MESSAGES: true,
          VIEW_CHANNEL: true,
        });
        // console.log(channel);
        const embed = new Discord.MessageEmbed().setDescription(`Support will be with you shortly.
      To close this ticket click on 🔒`).setTitle('ASAC Tickets System').setFooter('by Abdulhakim Zatar').setColor('#b006c6');
        await channel.send(`<@${button.clicker.user.id}> Welcome,

How can we help you?
Please write a description of your problem then do the following:
 - Go to "TEMPORARY CHANNELS" section.
 - Join ":hourglass:Waiting for Help:hourglass:".
 - Wait until one of the TAs move you to the breakout room.
      
One of our TAs will join you as soon as possible.`, { embed, component: row1 });
        // await button.clicker.fetch();
        // console.log(button.clicker);
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
        clickHandler(button, row2, button.id);
      }

      if (button.id === 'unclaim') {
        clickHandler(button, row1, button.id);
      }

      if (button.id === 'close') {
        await button.clicker.fetch();
        const embed = new Discord.MessageEmbed().setDescription(`Ticket closed by <@${button.clicker.user.id}>
      It will be deleted after three seconds`).setColor('#f44336');
        await button.channel.send(embed);
        setTimeout(async () => {
          button.channel.delete();
          // button.channel.setParent(CLOSED);
        }, 3000);
      }
    } catch (err) {
      console.log(err.message);
    }
  });
  // TA_ROLE
};

