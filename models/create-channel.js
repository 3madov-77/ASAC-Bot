'use strict';

module.exports = async (client, name, categoryID) => {
  return client.channels.create(name, { type: 'text', parent: categoryID });
};