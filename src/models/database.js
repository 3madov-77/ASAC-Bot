'use strict';

//------------------------------// Third Party Resources \\----------------------------\\
const pg = require('pg');
require('dotenv').config();

//----------------------------------// Export The Module \\----------------------------------\\
module.exports = new pg.Client(process.env.DATABASE_URL);

//---------------------------------------------------------------------------------------\\
