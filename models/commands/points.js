'use strict';

const points = require('../points');

module.exports = {
  commands: ['p', 'points'],
  expectedArgs: '<@user>',
  permissionError: 'You need instructor permissions to run this command',
  minArgs: 1,
  maxArgs: 1,
  callback: async (message, args, text) => {
    const id = args[0].slice(3, args[0].length - 1);
    console.log(args, id);
    const userPoints = await points.getPoints(id);
    message.reply(`${args[0]} has ${userPoints} points.`);
  },
  permissions: [],
  requiredRoles: ['Instructor', 'Dev'],
};