In order to disconnect an Identity you have be connected to the desired platform.
To proceed with disconnecting an identity follow the steps below:

1. Connect and initialize BidiPass SDK

```javascript
const PROVIDER_ID = 'provider1';
const ACCOUNT_KEY = '0x5689fa7c97a8f8cf10975f6f453472f09e9c9928ac81799128fcb3da68773cf0'; // {Manager Account} credentials

const bidipass = require('@bidipass/sdk'); // or require('./sdk/bidipass-loader.js');
const sdk = await bidipass(PROVIDER_ID, ACCOUNT_KEY);
```

2. Listen for mobile app to call disconnect endpoint (`DISCONNECT` used at on Identity connection)

```javascript
// You might use Express.js middleware to catch and validate payload
app.use('/bidipass/disconnect', sdk.identity.ThirdParty.Express.Middleware);

// ... in your controller
const user = request.$bidiPassIdentity;
```

3. Disconnect the identity

```javascript
await sdk.identity.unwhitelist(user);
```
