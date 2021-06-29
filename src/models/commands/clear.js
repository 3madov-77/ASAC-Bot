'use strict';

require('dotenv').config();
const TA_ROLE = process.env.TA_ROLE;
const tickets = require('../tickets/methods');

module.exports = {
  commands: ['clearTickets'],
  expectedArgs: '',
  permissionError: 'You need instructor/TA permissions to run this command',
  minArgs: 0,
  maxArgs: 0,
  callback: async (message, args, text) => {
    tickets.closeAll();
  },
  permissions: [],
  requiredRoles: ['Instructor', 'Teacher Assistant', 'Dev'],
};