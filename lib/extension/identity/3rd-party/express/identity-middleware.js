const { checkSchema } = require('express-validator/check');
const identitySchema = require('./validation/identity-schema');
const Identity = require('../../identity');
const debug = require('../../../../utils/debug')(__filename);

module.exports = [
  checkSchema(identitySchema),
  (req, _, next) => {
    const {
      providerId, uid,
      address, connection,
    } = req.body;

    // @todo refactor this, make configurable
    req.$bidiPassIdentity = Identity.$awake({
      providerId,
      uid,
      address,
      connection,
    });

    debug('identity', JSON.parse(req.$bidiPassIdentity.serialize()));

    next();
  },
];
