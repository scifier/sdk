const BaseApi = require('./base-api');
const OperationTimedOutError = require('./error/operation-timed-out-error');
const AuthorizationFailedError = require('./error/authorization-failed-error');
const debug = require('../../utils/debug')(__filename);

class AuthorizationRequest extends BaseApi {
  /**
   * Dispatch authorization requet
   * @param {number} timeout
   * @param {number} pollRate
   */
  async dispatch(
    timeout = AuthorizationRequest.DEFAULT_TIMEOUT,
    pollRate = AuthorizationRequest.DEFAULT_PULL_RATE,
  ) {
    const state = await this.waitForState(
      [
        AuthorizationRequest.State.APPROVED,
        AuthorizationRequest.State.REJECTED,
        AuthorizationRequest.State.CANCELED,
      ],
      timeout,
      pollRate,
    );

    if (state === AuthorizationRequest.State.CANCELED) {
      throw new AuthorizationFailedError(
        AuthorizationRequest.State.CANCELED,
        'Request was canceled',
      );
    } else if (state === AuthorizationRequest.State.REJECTED) {
      throw new AuthorizationFailedError(
        AuthorizationRequest.State.REJECTED,
        'Request was rejected by identity',
      );
    }

    return {
      token: await this.otpCode(),
      counter: await this.otpCounter(),
    };
  }

  /**
   * Wait for certain state[s]
   * @param {number|Array} states
   * @param {number} timeout
   * @param {number} pollRate
   */
  async waitForState(
    states,
    timeout = AuthorizationRequest.DEFAULT_TIMEOUT,
    pollRate = AuthorizationRequest.DEFAULT_PULL_RATE,
  ) {
    const validateState = s => (Array.isArray(states) ? states : [states]).indexOf(s) !== -1;

    return new Promise((resolve, reject) => {
      const watcher = this.contract.ChangeState.watch({ pollRate });
      const ttl = setTimeout(() => {
        debug('authorization:event:timeout', timeout);

        watcher.close();
        reject(new OperationTimedOutError(
          `The timeout of ${timeout}ms exceeded while waiting `
          + `for AuthorizationRequest states: ${states.join(', ')}`,
        ));
      }, timeout);

      watcher.on('data', (event) => {
        debug('authorization:event:data', event);

        if (validateState(event.args.newState)) {
          clearTimeout(ttl);
          watcher.close();
          resolve(event.args.newState);
        }
      });

      watcher.on('error', (error) => {
        debug('authorization:event:error', error);

        clearTimeout(ttl);
        watcher.close();
        reject(error);
      });
    });
  }

  /**
   * Get transaction details
   */
  async details() {
    const [
      opType, timestamp, description,
      symbol, amount, denomination,
      id, uid, state, stateReason,
      otpCode, otpCounter,
    ] = Object.values(await this.contract.details());

    return {
      id: this.cast.bytes32(id),
      uid: this.cast.bytes32(uid),
      opType,
      amount,
      symbol: this.cast.bytes32(symbol),
      denomination,
      description,
      timestamp,
      state,
      stateReason,
      otpCounter,
      otpCode: this.cast.bytes32(otpCode),
    };
  }

  /**
   * Get stateReason value
   */
  async stateReason() {
    return this.contract.stateReason();
  }

  /**
   * Get state value
   */
  async state() {
    return this.contract.state();
  }

  /**
   * Get otpCode value
   */
  async otpCode() {
    return this.cast.bytes32(await this.contract.otpCode());
  }

  /**
   * Get otpCounter value
   */
  async otpCounter() {
    return this.contract.otpCounter();
  }

  /**
   * Get transaction operation type
   */
  async opType() {
    return this.contract.opType();
  }

  /**
   * Get transaction timestamp
   */
  async timestamp() {
    return this.contract.timestamp();
  }

  /**
   * Get transaction description
   */
  async description() {
    return this.contract.description();
  }

  /**
   * Get transaction symbol
   */
  async symbol() {
    return this.cast.bytes32(await this.contract.symbol());
  }

  /**
   * Get transaction amount
   */
  async amount() {
    return this.contract.amount();
  }

  /**
   * Get transaction denomination
   */
  async denomination() {
    return this.contract.denomination();
  }

  /**
   * Get transaction id
   */
  async id() {
    return this.cast.bytes32(await this.contract.id());
  }

  /**
   * Get transaction uid
   */
  async uid() {
    return this.cast.bytes32(await this.contract.uid());
  }

  /**
   * Accept authorization request
   */
  async accept(...args) {
    return this.contract.accept(...args);
  }

  /**
   * Decline authorization request
   * @param {string} stateReason
   */
  async decline(stateReason, ...args) {
    return this.contract.decline(stateReason, ...args);
  }

  /**
   * Cancel authorization request
   */
  async cancel(...args) {
    return this.contract.cancel(...args);
  }

  /**
   * Approve authorization request
   * @param {string} otpCode
   */
  async approve(otpCode, ...args) {
    return this.contract.approve(this.cast.bytes32(otpCode), ...args);
  }

  /**
   * Reject authorization request
   */
  async reject(...args) {
    return this.contract.reject(...args);
  }

  /**
   * @inheritdoc
   */
  get $asyncProperties() {
    return [
      'uid', 'id', 'denomination',
      'amount', 'symbol', 'description',
      'timestamp', 'opType', 'otpCounter',
      'otpCode', 'state', 'stateReason',
    ];
  }

  /**
   * Operation types
   */
  static get OpType() {
    return {
      GENERIC: '0',
      DEBIT: '1',
      CREDIT: '2',
    };
  }

  /**
   * Request states
   */
  static get State() {
    return {
      PENDING: '0', // Send by platform
      APPROVED: '1', // Approved by user
      REJECTED: '2', // Rejected by user
      CANCELED: '3', // Cancelled by platform
      ACCEPTED: '4', // Accepted by platform
      DECLINED: '5', // Declined by platform
    };
  }

  /**
   * Default pull rate
   */
  static get DEFAULT_PULL_RATE() {
    return 500;
  }

  /**
   * Default timeout
   */
  static get DEFAULT_TIMEOUT() {
    return 120000;
  }

  /**
   * @inheritdoc
   */
  static get contractName() {
    return 'AuthorizationRequest';
  }
}

module.exports = AuthorizationRequest;
