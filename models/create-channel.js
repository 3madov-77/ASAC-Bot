'use strict';

module.exports = (message,name,categoryID) => {
  message.guild.channels.create(name,{type:'voice'}).then((channel)=>{
    channel.setParent(categoryID);
    channel.setUserLimit(5);
  });
};