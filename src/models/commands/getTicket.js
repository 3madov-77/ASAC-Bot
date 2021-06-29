'use strict';

require('dotenv').config();
const tickets = require('../tickets/methods');

module.exports = {
  commands: ['getTicket'],
  expectedArgs: 'id',
  permissionError: 'You need Dev permissions to run this command',
  minArgs: 1,
  maxArgs: 1,
  callback: async (message, args, text) => {
    tickets.getTicket(args[0]);
    // message.guild.roles.fetch();
    // const role = message.guild.roles.cache.get('856605767583137793')
    // console.log(role.members.members)
    // const Members = role.members.map(m => m.user.id);
    // console.log(Members.length);
    // // Members.forEach((member) => {
    // //   points.getPoints(member.id);
    // // });
  },
  permissions: [],
  requiredRoles: ['Dev'],
};