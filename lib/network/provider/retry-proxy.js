const pRetry = require('p-retry');
const debug = require('../../utils/debug')(__filename);

class RetryProxy {
  /**
   * @todo Abstract retry strategies
   * @param {EthereumProvider} provider 
   * @param {number} retries
   */
  constructor(provider, retries = 10) {
    this.provider = provider;
    this.retries = retries;
  }

  /**
   * Extend proxy object and hook send function
   * @param {number} retries
   */
  create(retries = null) {
    retries = retries || this.retries;

    debug(`Web3:ProxyProvider:${ this.provider.constructor.name }`, retries);

    const send = RetryProxy.wrapSend(
      this.provider.send.bind(this.provider),
      retries
    );

    return new Proxy(this.provider, {
      get: (target, propKey) => propKey === 'send' ? send : target[propKey],
    });
  }

  /**
   * Creates wrapper for send function
   * @param {Function} originalSendFn
   */
  static wrapSend(originalSendFn, retries) {
    return async (...args) => {
      return await pRetry(
        async () => {
          try {
            const result = await originalSendFn(...args);

            return result; // Otherwise it doesn't fail in this scope...
          } catch (error) {

            // @todo Fix it after web3.js gets rewritten... hopefully =)
            if (error.constructor.name === 'NetworkError'
              // || /^\s*Node\s+error\s*:/i.test(error.message)
              || /^\s*Connection\s+error\s*:/i.test(error.message)
            ) {
              return Promise.reject(error); // retryable
            }

            return Promise.reject(new pRetry.AbortError(error)); // non retryable
          }
        },
        {
          retries,
          onFailedAttempt: error => debug(
            `Web3:Provider:send`,
            `Retrying ${ error.attemptNumber } time due to ${ error.constructor.name }: "${ error.message }"`
          ),
        }
      );
    };
  }
}

module.exports = RetryProxy;
