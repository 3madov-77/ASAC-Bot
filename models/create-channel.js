'use strict';

module.exports = async (client, name, categoryID) => {
  await client.channels.create(name, { type: 'text', parent: categoryID });
};