const { Base64Encode } = require('base64-stream');
const streamToPromise = require('stream-to-promise');
const Serializable = require('../../utils/serializable');
const Connection = require('../otp/connection');
const CustomFields = require('./custom-fields');
const QR = require('./qr/branded-qr');

class Identity extends Serializable {
  /**
   * @param {string} providerId
   * @param {string} uid
   * @param {string} address
   * @param {Connection} connection
   *
   * @todo Remove platformId, change implementation
   */
  constructor(providerId, uid, address, connection) {
    super();

    this.providerId = providerId;
    this.uid = uid;
    this.address = address;
    this.connection = connection;
    this.custom = new CustomFields();
  }

  /**
   * Check if address has been set
   */
  get hasAddress() {
    return !!this.address;
  }

  /**
   * Generates branded QR code representation
   * @param {boolean} dataURI
   */
  async qr(dataURI = true) {
    const qr = new QR(this);

    const stream = await qr.generate();

    if (dataURI) {
      const base64Stream = new Base64Encode({ prefix: 'data:image/png;base64,' });

      stream.pipe(base64Stream);

      return streamToPromise(base64Stream);
    }

    return stream;
  }

  /**
   * @inheritdoc
   */
  static $awake(obj) {
    const self = Object.assign(new this(), obj);

    self.custom = CustomFields.$awake(self.custom);
    self.connection = Connection.$awake(self.connection);

    return self;
  }
}

module.exports = Identity;
