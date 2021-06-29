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

  async checkTicket2(userId) {
    const SQL = `SELECT id FROM tickets WHERE creator=$1 AND status=$2;`;
    const value = [userId, 'open'];
    const result = await pg.query(SQL, value);
    return result.rows.length > 1 ? true : false;
  }

  async isClaimed(channelId) {
    const SQL = `SELECT id FROM tickets WHERE id=$1 AND status=$2;`;
    const value = [channelId, 'claimed'];
    const result = await pg.query(SQL, value);
    return result.rows.length > 0 ? true : false;
  }

  async claimTicket(userId, channelId) {
    const SQL = `UPDATE tickets SET status=$2,claimer=$4 WHERE id=$1 AND status=$3 RETURNING id;`;
    const value = [channelId, 'claimed', 'open', userId];
    const result = await pg.query(SQL, value);
    return result.rows.length > 0 ? true : false;
  }

  async unClaimTicket(channelId) {
    const SQL = `UPDATE tickets SET status=$2,claimer=$3 WHERE id=$1 AND status=$4;`;
    const value = [channelId, 'open', null,'claimed'];
    await pg.query(SQL, value);
  }

  async checkClaimer(userId, channelId) {
    const SQL = `SELECT * FROM tickets WHERE id=$1;`;
    const value = [channelId];
    const result = await pg.query(SQL, value);
    return result.rows[0].status === 'open' ? true : result.rows[0].claimer == userId ? true : false;
  }

  async addTicket(userId, channelId, name) {
    const SQL = `INSERT INTO tickets(id,creator,name) VALUES($2,$1,$3)`;
    const value = [userId, channelId, name];
    await pg.query(SQL, value);
  }

  async deleteTicket(channelId) {
    const SQL = `DELETE FROM tickets WHERE id=$1`;
    const value = [channelId];
    await pg.query(SQL, value);
  }

  async closeTicket(channelId) {
    const SQL = `UPDATE tickets SET status=$2 WHERE id=$1;`;
    const value = [channelId, 'closed'];
    await pg.query(SQL, value);
  }

  async closeAll() {
    const SQL = `UPDATE tickets SET status=$1`;
    const value = ['closed'];
    await pg.query(SQL, value);
  }

}


module.exports = new Tickets();

//-----------------------------------------------------------------------------------------\\
