In order to list Authorization Requests you have to create the provider and add a manager account.
To proceed with listing the requests follow the steps below:

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

3. Get total requests (optional)

```javascript
const totalRequests = await sdk.action.total(user);
```

4. Perform listing

```javascript
const requests = await sdk.action.list(user);
// ...do something with requests array

// Retrieve next batch of requests
if (!requests.isIncomplete) {
  const nextRequests = await sdk.action.list(
    user,
    requests.offsetItem
    /* items = 10 */
  );
}
```

**[NEXT](tutorial-disconnect-identity.html)**
