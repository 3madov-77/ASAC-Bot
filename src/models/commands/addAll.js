'use strict';

require('dotenv').config();
const TA_ROLE = process.env.TA_ROLE;
const points = require('../points/index');

module.exports = {
  commands: ['addAll'],
  expectedArgs: '',
  permissionError: 'You need Dev permissions to run this command',
  minArgs: 0,
  maxArgs: 0,
  callback: async (message, args, text) => {
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