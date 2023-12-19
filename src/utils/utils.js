const { Axiom } = require('@axiomhq/js');
require('dotenv').config();
const CONFIG = require("../configs/config")

const axiom = new Axiom({
  token: CONFIG.axiomToken,
  orgId: CONFIG.axiomOrgId,
});

module.exports = { axiom };