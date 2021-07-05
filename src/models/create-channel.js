'use strict';
require('dotenv').config();
const TA_ROLE = process.env.TA_ROLE;
const INST_ROLE = process.env.INST_ROLE;
//---------------------------------// Create Channel \\-------------------------------\\

module.exports = async (client, name, categoryID, type, id) => {
  return client.channels.create(name, {
    type, parent: categoryID,
    permissionOverwrites: [
      {
        id: client.id,
        deny: ['VIEW_CHANNEL'],
      }, {
        id,
        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_CHANNELS'],
      }, {
        id: TA_ROLE,
        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES','MANAGE_CHANNELS'],
      }, {
        id: INST_ROLE,
        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES','MANAGE_CHANNELS'],
      }],
  });
};
//-----------------------------------------------------------------------------------------\\
