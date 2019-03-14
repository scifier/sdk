const Serializable = require('../../utils/serializable');
const speakeasy = require('speakeasy');
const debug = require('../../utils/debug')(__filename);

class Connection extends Serializable {
  /**
   * @param {string} secret 
   * @param {string} connectEndpoint 
   * @param {string} disconnectEndpoint
   */
  constructor(secret, connectEndpoint, disconnectEndpoint) {
    super();

    this.secret = secret;
    this.connectEndpoint = connectEndpoint;
    this.disconnectEndpoint = disconnectEndpoint;
  }

  /**
   * Verify HOTP token within a validation window
   * @param {string} token 
   * @param {number} counter 
   * @param {number} window We HIGHLY encourage keeping it 0 to mitigate replay attacks
   */
  verify(token, counter, window = Connection.TOKEN_WINDOW) {
    debug(
      'verify',
      `token=${ token }`,
      `secret=${ this.secret }`,
      `counter=${ counter }`,
      `window=${ window }`
    );
    
    return speakeasy.hotp.verify({ secret: this.secret, counter, token, window });
  }

  /**
   * Generate HOTP token
   * @param {number} counter 
   */
  generateToken(counter) {
    debug(
      'token:generate',
      `secret=${ this.secret }`,
      `counter=${ counter }`
    );

    return speakeasy.hotp({ secret: this.secret, counter });
  }

  /**
   * Create a new connection
   * @param {string} connectEndpoint 
   * @param {string} disconnectEndpoint
   * @param {number} length 
   */
  static create(connectEndpoint, disconnectEndpoint, length = this.SECRET_LENGTH) {
    const secret = speakeasy.generateSecret({ length });

    debug(
      'create',
      `secret=${ secret[this.SECRET_ENCODING] }`,
      `connectEndpoint=${ connectEndpoint }`,
      `disconnectEndpoint=${ disconnectEndpoint }`
    );

    return new this(
      secret[this.SECRET_ENCODING],
      connectEndpoint,
      disconnectEndpoint
    );
  }

  /**
   * Default token window
   */
  static get TOKEN_WINDOW() {
    return 0;
  }

  /**
   * Default secret length
   */
  static get SECRET_LENGTH() {
    return 256;
  }

  /**
   * Default secret encoding
   */
  static get SECRET_ENCODING() {
    return 'ascii';
  } 
}

module.exports = Connection;
