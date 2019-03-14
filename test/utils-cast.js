const { expect } = require('chai');
const web3Utils = require('web3-utils');
const cast = require('../lib/contracts/api/helpers/cast');

suite('Cast <lib>', async function() {
  test('should cast address', async function() {
    const checksummAddress = '0xBF57DA2C87Cd671C62e172f2270232813525C6e7';
    const address = checksummAddress.toLowerCase();
    const nullAddress = '0x0';
    const emptyString = '';
    const zeroNumber = 0;

    expect(cast.address(checksummAddress)).to.be.equal(checksummAddress);
    expect(cast.address(address)).to.be.equal(address);
    expect(cast.address(nullAddress)).to.be.equal(web3Utils.padRight(nullAddress, 40));
    expect(cast.address(emptyString)).to.be.equal(web3Utils.padRight(nullAddress, 40));
    expect(cast.address(zeroNumber)).to.be.equal(web3Utils.padRight(nullAddress, 40));
  });
});
