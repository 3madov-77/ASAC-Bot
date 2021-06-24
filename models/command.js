'use strict';
require('dotenv').config();
const prefix = process.env.PREFIX;

module.exports = (client, aliases, callback) => {
  if (typeof aliases === 'string') aliases = [aliases];

  client.on('message', (msg) => {
    const { content } = msg;
    aliases.forEach(alias => {
      const command = `${prefix}${alias}`;

      if (content.startsWith(`${command} `) || content === command) {
        console.log(command, 'working');
        callback(msg);
      }
    });
  });
};