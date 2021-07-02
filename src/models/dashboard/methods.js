//------------------------------// Third Party Resources \\----------------------------\\
const { GuildMemberManager } = require('discord.js');
//---------------------------------// Import Resources \\-------------------------------\\
const pg = require('../database');
require('dotenv').config();

//--------------------------------// Esoteric Resources \\-------------------------------\\
const GUILD = process.env.GUILD;
const TA_ROLE = process.env.TA_ROLE;
const STUDENT_ROLE = process.env.STUDENT_ROLE;
const MEETINGS = process.env.MEETINGS;
const EXCUSED = process.env.EXCUSED;
const MOCK = process.env.MOCK;

//---------------------------------// Tickets Class \\-------------------------------\\
class Dashboard {

  async getUsers(client) {
    const SQL = `SELECT * FROM users`;
    const results = await pg.query(SQL);
    const SQL2 = `SELECT claimer FROM tickets WHERE status='claimed';`;
    const results2 = await pg.query(SQL2);
    const tickets = results2.rows.map((ticket) => ticket.claimer);
    const TAs = { available: [], inTicket: [], notAvailable: [], excused: [] };
    const discordServer = client.guilds.cache.get(GUILD);
    await discordServer.members.fetch();


    results.rows.forEach(async (user) => {
      const member = discordServer.members.cache.get(user.id);
      const name = discordServer.member(member.user).displayName;
      user = { id: user.id, name, points: user.points, last: user.last };
      if (tickets.includes(user.id)) {
        TAs.inTicket.push(user);
        return;
      }

      if (member.roles.cache.has(EXCUSED)) {
        TAs.excused.push(user);
        return;
      }

      if (member.roles.cache.has(MEETINGS) || member.roles.cache.has(MOCK)) {
        TAs.notAvailable.push(user);
        return;
      }

      if (member.voice.channel) {
        if (member.voice.channel.name === '☕ Break ☕' || member.voice.channel.name === '🛑Currently not Available🛑') {
          TAs.notAvailable.push(user);
          return;
        }
      }

    });
    return TAs;
  }

  async getTotals(client) {
    const SQL = `SELECT COUNT(id) FROM tickets`;
    const results = await pg.query(SQL);
    let students = 0;
    let TAs = 0;
    const tickets = results.rows[0].count;

    const discordServer = client.guilds.cache.get(GUILD);

    const members = await discordServer.members.fetch();
    members.forEach(member => {
      if (member.roles.cache.has(TA_ROLE)) TAs++;
      if (member.roles.cache.has(STUDENT_ROLE)) students++;
    });

    return {tickets,TAs,students};
  }

}

module.exports = new Dashboard();

//-----------------------------------------------------------------------------------------\\
