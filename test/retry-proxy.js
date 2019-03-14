const { expect } = require('chai');
const RetryProxy = require('../lib/network/provider/retry-proxy');

class ProviderMock {
  constructor() {
    this.error = null;
    this.errorRotate = [];
    this.succeedAfter = Infinity;
    this.invocations = 0;
    this._errorRotationIdx = 0;
  }

  reset() {
    this.succeedAfter = Infinity;
    this.invocations = 0;

    this.resetError();
  }

  resetError() {
    this.error = null;
    this.errorRotate = [];
    this._errorRotationIdx = 0;
  }

  /**
   * Send mock
   */
  send() {
    this.invocations++;

    return new Promise((resolve, reject) => {
      const error = this._error;

      if (error) {
        if (this.succeedAfter <= this.invocations) {
          this.resetError();

          return resolve();
        }

        reject(error);
      }

      resolve();
    });
  }
  
  _errorObj(error) {
    return typeof error === 'object' ? error : new Error(error);
  }

  get _error() {
    if (this.error) {
      return this._errorObj(this.error);
    } else if (this.errorRotate.length > 0) {
      if (this._errorRotationIdx >= this.errorRotate.length) {
        this._errorRotationIdx = 0;
      }

      const error = this.errorRotate[this._errorRotationIdx];

      this._errorRotationIdx++;

      return this._errorObj(error);
    }

    return null;
  }
}

class NetworkError extends Error {}

suite('RetryProxy <lib>', async function() {
  const providerMock = new ProviderMock();
  const proxy = new RetryProxy(providerMock);
  const provider = proxy.create(retries = 2);

  test('should retry in case of RPC failure', async function() {
    providerMock.reset();
    providerMock.errorRotate = [
      'Connection error: Some random error...',
      'Connection error: Other random error...',
      new NetworkError('Some random error...'),
    ];
    let error = null;

    try {
      await provider.send();
    } catch (e) {
      error = e;
    }

    expect(error).to.be.instanceof(NetworkError);
    expect(providerMock.invocations).to.be.equal(3);
  });

  test('should stop retrying in case of RPC recovers', async function() {
    providerMock.reset();
    providerMock.error = 'Connection error: Some random error...';
    providerMock.succeedAfter = 2;
    let error = null;

    try {
      await provider.send();
    } catch (e) {
      error = e;
    }

    expect(error).to.be.null;
    expect(providerMock.invocations).to.be.equal(2);
  });
});
