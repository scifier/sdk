/** Test network definition */
const TESTNET_PROTOCOL = 'http';
const TESTNET_HOST = '192.168.1.28';
const TESTNET_PORT = 8902;
const TESTNET_ID = '346965197';
const TESTNET_ACCOUNTS = process.env.ACCOUNTS;
/** eod */

/** Stage network definition */
const STAGE_PROTOCOL = 'http';
const STAGE_HOST = '52.71.173.249';
const STAGE_PORT = 8902;
const STAGE_ID = '346965197';
const STAGE_ACCOUNTS = process.env.ACCOUNTS;
/** eod */

/** Live network definition */
const LIVE_PROTOCOL = 'http';
const LIVE_HOST = '13.52.49.229';
const LIVE_PORT = 8902;
const LIVE_ID = '346965197';
const LIVE_ACCOUNTS = process.env.ACCOUNTS;
/** eod */

function accounts(rawAccounts) {
  return (rawAccounts || '').split(',')
    .filter(Boolean)
    .map(pk => pk.replace(/^0x/, ''));
}

function assertAccounts(accounts) {
  if (accounts.length <= 0) {
    throw new Error(
      `No accounts passed for deployment on network.` +
      'You should pass "ACCOUNTS" environmental variable containing private keys of unlocked accounts.'
    );
  }
}

module.exports = {
  solc: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*',
      gasPrice: 0,
      /** USED BY SDK */
      protocol: 'http',
    },
    testing: {
      provider() {
        const keys = accounts(TESTNET_ACCOUNTS);

        assertAccounts(keys);

        // This should be imported on call to avoid issues on SDK initialization
        const HDWalletProvider = require('truffle-hdwallet-provider-privkey');

        return new HDWalletProvider(keys, `${TESTNET_PROTOCOL}://${TESTNET_HOST}:${TESTNET_PORT}`);
      },
      /** USED BY SDK */
      protocol: TESTNET_PROTOCOL,
      host: TESTNET_HOST,
      port: TESTNET_PORT,
      /** END */
      network_id: TESTNET_ID,
      gasPrice: 0,
    },
    stage: {
      provider() {
        const keys = accounts(STAGE_ACCOUNTS);

        assertAccounts(keys);

        // This should be imported on call to avoid issues on SDK initialization
        const HDWalletProvider = require('truffle-hdwallet-provider-privkey');

        return new HDWalletProvider(keys, `${STAGE_PROTOCOL}://${STAGE_HOST}:${STAGE_PORT}`);
      },
      /** USED BY SDK */
      protocol: STAGE_PROTOCOL,
      host: STAGE_HOST,
      port: STAGE_PORT,
      /** END */
      network_id: STAGE_ID,
      gasPrice: 0,
    },
    live: {
      provider() {
        const keys = accounts(LIVE_ACCOUNTS);

        assertAccounts(keys);

        // This should be imported on call to avoid issues on SDK initialization
        const HDWalletProvider = require('truffle-hdwallet-provider-privkey');

        return new HDWalletProvider(keys, `${LIVE_PROTOCOL}://${LIVE_HOST}:${LIVE_PORT}`);
      },
      /** USED BY SDK */
      protocol: LIVE_PROTOCOL,
      host: LIVE_HOST,
      port: LIVE_PORT,
      /** END */
      network_id: LIVE_ID,
      gasPrice: 0,
    },
  },
};
