'use strict';

module.exports = (message, reactions) => {
  message.react(reactions[0]);
  reactions.shift();
  if (reactions.length > 0) {
    setTimeout(() => {
      this(message, reactions);
    }, 750);
  }
};