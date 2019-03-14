const { expect } = require('chai');
const Connection = require('../lib/extension/otp/connection');

suite('OTP', async function() {
  const connectEndpoint = 'https://example.com/bidipass/connection';
  const disconnectEndpoint = 'https://example.com/bidipass/disconnection';
  
  test('should generate valid connection', async function() {
    const { sdk } = global.BIDIPASS;

    const connection = sdk.otp.generate(connectEndpoint, disconnectEndpoint);
    const repr = connection.serialize();
    const restoredConnection = sdk.otp.restore(repr);

    expect(connection.connectEndpoint).to.be.equal(connectEndpoint);
    expect(connection.disconnectEndpoint).to.be.equal(disconnectEndpoint);
    expect(connection.secret).to.have.lengthOf(Connection.SECRET_LENGTH);
    expect(repr).to.be.a('string');
    expect(restoredConnection).to.be.an.instanceof(Connection);
    expect(connection.connectEndpoint).to.be.equal(restoredConnection.connectEndpoint);
    expect(connection.disconnectEndpoint).to.be.equal(restoredConnection.disconnectEndpoint);
    expect(connection.secret).to.be.equal(restoredConnection.secret);
  });
});
