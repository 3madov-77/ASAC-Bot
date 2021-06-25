'use strict';
const Discord = require('discord.js');
const fs = require('fs');
require('dotenv').config();
const taRole = process.env.TA_ROLE;
const instRole = process.env.INST_ROLE;

let claimedTickets = [];

const getTickets = () => {
  claimedTickets = JSON.parse(fs.readFileSync('tickets.json', 'utf-8'));
};

const updateTickets = (newClaimedTickets) => {
  newClaimedTickets = JSON.stringify(newClaimedTickets);
  fs.writeFileSync('tickets.json', newClaimedTickets, function (err) {
    console.log(err.message);
  });
};

const checkClaim = (channelID) => {
  getTickets();
  let flag = false;
  let claimerID;
  claimedTickets.forEach((ticket) => {
    if (channelID == ticket.channelID) {
      flag = true;
      claimerID = ticket.claimerID;
    }
  });
  return flag ? { flag, claimerID } : flag;
};

const claimTicket = (channelID, claimerID) => {
  claimedTickets.push(channelID, claimerID);
  updateTickets(claimedTickets);
};



module.exports = async (button, row, type) => {
  getTickets  ();
  const roles = button.clicker.member._roles;
  if (type === 'claim' && (roles.includes(taRole) || roles.includes(instRole))) {
    console.log('?');
    // claimTicket(button.channel.id, button.clicker.id);
  }
  // button.message.content, { embed, component: row }
  const embedClaim = new Discord.MessageEmbed().setDescription(`Ticket ${type}ed by <@${button.clicker.user.id}>`).setColor(type === 'claim' ? '#4CAF50' : '#f44336');
  button.channel.send(embedClaim);
  const embed = new Discord.MessageEmbed().setDescription(`Support will be with you shortly.
  To close this ticket click on 🔒`).setTitle('ASAC Tickets System').setFooter('by Abdulhakim Zatar').setColor('#b006c6');
  await button.message.edit(button.message.content, { embed, component: row });
};