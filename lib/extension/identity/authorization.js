const AuthorizationFailedError = require('../../contracts/api/error/authorization-failed-error');
const OperationTimedOutError = require('../../contracts/api/error/operation-timed-out-error');
const AuthorizationRequest = require('../../contracts/api/AuthorizationRequest');
const debug = require('../../utils/debug')(__filename);

class Authorization {
  /**
   * @param {Function} generator 
   * @param {Identity} identity
   */
  constructor(generator, identity) {
    this._generator = generator;
    this.identity = identity;
    this.request = null;
  }

  /**
   * Send request
   */
  async send() {
    if (!this.request) {
      this.request = await this._generator();
    }

    return this.request;
  }

  /**
   * Dispatch authorization request
   * @param {number} timeout 
   */
  async dispatch(timeout = AuthorizationRequest.DEFAULT_TIMEOUT) {
    await this.send();

    try {
      const { token, counter } = await this.request.dispatch(timeout);

      debug(`authorization:approved`, token, counter);

      if (this.identity.connection.verify(token, counter)) {
        await this.request.accept();

        debug(`authorization:accepted`, token, counter);
      } else {
        const reason = 'Invalid OTP token';

        await this.request.decline(reason);

        throw new AuthorizationFailedError(
          AuthorizationRequest.State.DECLINED,
          reason
        );
      }
    } catch (e) {
      // @todo cover edge case
      if (e instanceof OperationTimedOutError) {
        await this.request.cancel();

        e = new AuthorizationFailedError(
          AuthorizationRequest.State.CANCELED,
          'Operation canceled by platform'
        );
      }

      debug(`authorization:error`, e);

      throw e;
    }
    
    return this.request;
  }

  /**
   * Create an authorization request
   * @param {Identity} identity 
   * @param {*} instance 
   * @param {string} method
   * @param  {*} args 
   */
  static create(identity, instance, method, ...args) {
    return new this(async () => {
      debug(`${ method }:send`, ...args);

      return instance[method].call(instance, ...args);
    }, identity);
  }
}

module.exports = Authorization;
