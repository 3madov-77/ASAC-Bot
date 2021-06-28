'use strict';

//---------------------------------// Create Channel \\-------------------------------\\

module.exports = async (client, name, categoryID, type, id) => {
  return client.channels.create(name, {
    type, parent: categoryID,
    permissionOverwrites: [{
      id,
      allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
    }],
  });
};
//-----------------------------------------------------------------------------------------\\
