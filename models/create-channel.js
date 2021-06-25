'use strict';

module.exports = (client,name,categoryID) => {
  client.channels.create(name,{type:'text'}).then((channel)=>{
    channel.setParent(categoryID);
    // channel.setUserLimit(5);
  });
};