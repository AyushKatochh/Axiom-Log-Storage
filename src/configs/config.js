// config.js
require('dotenv').config(); // Load environment variables from .env file

const CONFIG = {
  axiomToken: process.env.AXIOM_TOKEN,
  axiomOrgId: process.env.AXIOM_ORG_ID
};

module.exports = CONFIG;
