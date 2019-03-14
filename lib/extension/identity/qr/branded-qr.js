const sharp = require('sharp');
const path = require('path');
const QR = require('./qr');

class BrandedQR extends QR {
  /**
   * @param {Identity} identity 
   * @param {string} logo 
   */
  constructor(identity, logo = BrandedQR.DEFAULT_LOGO) {
    super(identity);

    this.logo = logo;
  }

  /**
   * @inheritdoc
   */
  async generate(options) {
    const pipeline = sharp();
    const qrStream = await super.generate(options);

    pipeline
      .overlayWith(this.logo, {
        gravity: sharp.gravity.centre,
        density: 100,
      });

    qrStream.pipe(pipeline);

    return pipeline.png();
  }

  /**
   * Default logo path
   */
  static get DEFAULT_LOGO() {
    return path.join(__dirname, 'assets/logo.png');
  }
}

module.exports = BrandedQR;
