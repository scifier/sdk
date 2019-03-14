In order to proceed to action authorization you need to connect the Identity to the provider.
To proceed with connecting an identity follow the steps below:

1. Connect and initialize BidiPass SDK

```javascript
const PROVIDER_ID = 'provider1';
const ACCOUNT_KEY = '0x5689fa7c97a8f8cf10975f6f453472f09e9c9928ac81799128fcb3da68773cf0'; // {Manager Account} credentials

const bidipass = require('@bidipass/sdk'); // or require('./sdk/bidipass-loader.js');
const sdk = await bidipass(PROVIDER_ID, ACCOUNT_KEY);
```

2. Restore the Identity from it's representation (e.g. `identityRepr` stored in DB)

```javascript
const user = sdk.identity.restore(identityRepr);
```

3. Create Action object

```javascript
const originalId = 'action1';
const description = 'Settle 10 ether';
const symbol = 'ETH';
const amount = 10 * (10 ** 18);
const denomination = 10 ** 18;
const opType = sdk.action.Item.DEBIT;

const value = new sdk.action.Value(symbol, amount, denomination);
const action = new sdk.action.Item(originalId, description, value, opType);
```

4. Trigger the authorization request

```javascript
// It will throw if failed or 120 seconds timeout exceeded
const authorization = sdk.identity.authorize(user, action);

await authorization.dispatch();

// To cancel it use: await authorization.request.cancel();
```

**[NEXT](tutorial-list-requests.html)**
