'use strict';

module.exports = async (client, name, categoryID, userID) => {
  return client.channels.create(name, {
    type: 'text', parent: categoryID,
  });
};