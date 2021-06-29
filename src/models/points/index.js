'use strict';

//---------------------------------// Import Resources \\-------------------------------\\
const pg = require('../database');

//---------------------------------// Bot Loading \\-------------------------------\\
class Points {

  async getPoints(userId) {
    const SQL = `SELECT points FROM users WHERE id=$1`;
    const value = [userId];
    const result = await pg.query(SQL, value);
    if (result.rows.length > 0) return result.rows[0].points;
    this.addUser(userId);
    return 0;
  }

  async addUser(userId) {
    const SQL = `INSERT INTO users(id) VALUES($1);`;
    const value = [userId];
    await pg.query(SQL, value);
  }

  async addPoint(userId) {
    const SQL = `UPDATE users SET points=points+1 WHERE id=$1 RETURNING id`;
    const value = [userId];
    const result = await pg.query(SQL, value);
    if (result.rows.length == 0) this.addUser(userId);
  }

  async removePoint(userId) {
    const SQL = `UPDATE users SET points=points+1 WHERE id=$1 RETURNING id`;
    const value = [userId];
    const result = await pg.query(SQL, value);
    if (result.rows.length == 0) this.addUser(userId);
  }

  async topPoints() {
    const SQL = `SELECT * FROM users ORDER BY points desc limit 10;`;
    const results = await pg.query(SQL);
    return results.rows;
  }

  async all() {
    const SQL = `SELECT * FROM users ORDER BY points desc;`;
    const results = await pg.query(SQL);
    return results.rows;
  }
}

module.exports = new Points();
//-----------------------------------------------------------------------------------------\\
