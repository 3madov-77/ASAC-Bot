//------------------------------// Third Party Resources \\----------------------------\\

//---------------------------------// Import Resources \\-------------------------------\\
const pg = require('../database');

//--------------------------------// Esoteric Resources \\-------------------------------\\

//---------------------------------// Tickets Class \\-------------------------------\\
class Tickets {

  async checkTicket(userId) {
    const SQL = `SELECT id FROM tickets WHERE creator=$1 AND status=$2;`;
    const value = [userId, 'open'];
    const result = await pg.query(SQL, value);
    return result.rows.length > 0 ? true : false;
  }

  async isClaimed(channelId) {
    const SQL = `SELECT id FROM tickets WHERE id=$1 AND status=$2;`;
    const value = [channelId, 'claimed'];
    const result = await pg.query(SQL, value);
    return result.rows.length > 0 ? true : false;
  }

  async claimTicket(userId, channelId) {
    const SQL = `UPDATE tickets SET status=$2 WHERE id=$1 AND status=$3 RETURNING id;`;
    const value = [channelId, 'claimed', 'open'];
    const result = await pg.query(SQL, value);
    return result.rows.length > 0 ? true : false;
  }

  async unClaimTicket(channelId) {
    const SQL = `UPDATE tickets SET status=$2 WHERE id=$1;`;
    const value = [channelId, 'open'];
    await pg.query(SQL, value);
  }

  async checkClaimer(userId, channelId) {
    //check open
    //check the claimer
  }

  async addTicket(userId, channelId) {
    const SQL = `INSERT INTO tickets(id,creator) VALUES($2,$1);`;
    const value = [userId, channelId];
    await pg.query(SQL, value);
  }

  async closeTicket(channelId) {
    const SQL = `UPDATE tickets SET status=$2 WHERE id=$1;`;
    const value = [channelId, 'closed'];
    await pg.query(SQL, value);
  }

}


module.exports = new Tickets();

//-----------------------------------------------------------------------------------------\\
