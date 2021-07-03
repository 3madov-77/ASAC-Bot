//------------------------------// Third Party Resources \\----------------------------\\
const { GuildMemberManager } = require("discord.js");
//---------------------------------// Import Resources \\-------------------------------\\
const pg = require("../database");
const moment = require("moment");
require("dotenv").config();

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
        if (
          member.voice.channel.name === "☕ Break ☕" ||
          member.voice.channel.name === "🛑Currently not Available🛑"
        ) {
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
    members.forEach((member) => {
      if (member.roles.cache.has(TA_ROLE)) TAs++;
      if (member.roles.cache.has(STUDENT_ROLE)) students++;
    });

    return { tickets, TAs, students };
  }

  toTimestamp(strDate) {
    let datum = Date.parse(strDate);
    return datum / 1000;
  }

  async getHours() {
    let timeStamp = new Date(Date.now());
    let date = moment(timeStamp).add(1, "hour").format("MM/DD/YYYY HH:00:00");

    // console.log(date, this.toTimestamp(date));
    date = this.toTimestamp(date);

    let startTime = date - 24 * 3600;
    let endTime = date;

    const sql = `SELECT opened FROM tickets WHERE opened BETWEEN $1 AND $2;`;
    let values = [startTime, endTime];
    console.log(values, "values");

    let results = await pg.query(sql, values);
    let ticketsIn24 = results.rows;
    console.log(results.rows, "results.rows");
    let ticketsPerHour = [];

    for (let i = 0; i <= 23; i++) {
      let from = startTime + i * 3600;
      let to = from + 3600;
      console.log(from, to, i, "to");
      let numOfTickets = 0;

      ticketsIn24.forEach((ticket) => {
        // console.log('ticket',from, ticket.opened)
        if (ticket.opened < to && ticket.opened >= from) {
          numOfTickets++;
        }
      });

      timeStamp = new Date(to * 1000 - 3600);
      date = moment(timeStamp).format("HH:00");
      // console.log('date',date)
      ticketsPerHour.push({ hour: date, numOfTickets });
    }
    return ticketsPerHour;
  }

  async dailyTicketsInfo() {
    let timeStamp = new Date(Date.now());
    let date = moment(timeStamp).format("MM/DD/YYYY HH:59:59");

    // console.log(date, this.toTimestamp(date));
    date = this.toTimestamp(date);

    let startTime = date - 12 * 3600;
    let endTime = date;

    const sql = `SELECT status, count(*) FROM tickets WHERE opened BETWEEN $1 AND $2 GROUP BY status;`;
    let values = [startTime, endTime];
    console.log(values, "values");

    let results = await pg.query(sql, values);
    let ticketsIn24 = results.rows;
    let ticketsIn24Obj = { opened: 0, closed: 0, claimed: 0 };

    ticketsIn24.forEach((ticket) => {
      if (ticket.status === "open") {
        ticketsIn24Obj.opened = ticket.count;
      }

      if (ticket.status === "closed") {
        ticketsIn24Obj.closed = ticket.count;
      }

      if (ticket.status === "claimed") {
        ticketsIn24Obj.claimed = ticket.count;
      }
    });
    //  console.log('ticketsIn24Obj',ticketsIn24Obj)
    return ticketsIn24Obj;
  }

  async dailyTicketsLevels() {
    let timeStamp = new Date(Date.now());
    let date = moment(timeStamp).format("MM/DD/YYYY HH:59:59");

    // console.log(date, this.toTimestamp(date));
    date = this.toTimestamp(date);

    let startTime = date - 12 * 3600;
    let endTime = date;

    const sql = `SELECT name FROM tickets WHERE opened BETWEEN $1 AND $2;`;
    let values = [startTime, endTime];

    let results = await pg.query(sql, values);
    let ticketsIn24 = results.rows;
    let ticketsIn24Obj = {
      102: 0,
      201: 0,
      301: 0,
      "401js": 0,
      "401java": 0,
      "401py": 0,
    };

    ticketsIn24.forEach((ticket) => {
      let level = ticket.name.split("-")[0];

      console.log(level, "level");

      switch (level) {
        case "102":
          ticketsIn24Obj["102"]++;
          break;
        case "201":
          ticketsIn24Obj["201"]++;
          break;
        case "301":
          ticketsIn24Obj["301"]++;
          break;
        case "401js":
          ticketsIn24Obj["401js"]++;
          break;
        case "401java":
          ticketsIn24Obj["401java"]++;
          break;
        case "401py":
          ticketsIn24Obj["401py"]++;
          break;

        default:
          break;
      }
    });
    // console.log(ticketsIn24Obj);
    return ticketsIn24Obj;
  }

  async avgerage() {
    let timeStamp = new Date(Date.now());
    let date = moment(timeStamp).format("MM/DD/YYYY HH:59:59");

    // console.log(date, this.toTimestamp(date));
    date = this.toTimestamp(date);

    let startTime = date - 12 * 3600;
    let endTime = date;

    const sql = `SELECT opened, claimed, closed FROM tickets WHERE claimed IS NOT NULL AND opened BETWEEN $1 AND $2;`;
    let values = [startTime, endTime];

    let results = await pg.query(sql, values);
    let ticketsIn24 = results.rows;

    console.log(ticketsIn24, "ticketsIn24");

    let avgOpened = 0,
      avgClaimed = 0,
      ticketClosed = 0;

    ticketsIn24.forEach((ticket) => {
      if (ticket.closed && ticket.claimed) {
        ticketClosed++;
        avgClaimed += ticket.closed - ticket.claimed;
      }
      avgOpened += ticket.claimed - ticket.opened;
    });
    avgClaimed = avgClaimed / ticketClosed;

    avgOpened = avgOpened / ticketsIn24.length;

    const sql2 = `SELECT COUNT(creator) FROM tickets WHERE opened BETWEEN $1 AND $2 GROUP BY creator;`;
    let results2 = await pg.query(sql2, values);
    console.log(results2.rows);

    let avgTicketsPerStudent = 0;
    results2.rows.forEach((ticket) => {
      avgTicketsPerStudent += Number(ticket.count);
    });
    avgTicketsPerStudent = avgTicketsPerStudent / results2.rows.length;
    return { avgClaimed, avgOpened, avgTicketsPerStudent };
  }
}

module.exports = new Dashboard();

//-----------------------------------------------------------------------------------------\\
