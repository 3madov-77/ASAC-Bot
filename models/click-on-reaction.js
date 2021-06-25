'use strict';

module.exports = async (client) => {
  const channelID = '856769450332913704';

  const channel = await client.channels.fetch(channelID);
  // channel.send('test');
};