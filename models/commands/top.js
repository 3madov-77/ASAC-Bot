'use strict';

const points = require('../points');

module.exports = {
  commands: ['t', 'top'],
  expectedArgs: '<@user>',
  permissionError: 'You need instructor/TA permissions to run this command',
  minArgs: 0,
  maxArgs: 0,
  callback: async (message, args, text) => {
    const top = await points.topPoints();
    console.log(top);
    // message.reply(`${args[0]} has ${userPoints} points.`);
  },
  permissions: [],
  requiredRoles: ['Instructor', 'Teacher Assistant'],
};