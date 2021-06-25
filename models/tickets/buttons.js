'use strict';
const { MessageButton, MessageActionRow } = require('discord-buttons');

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