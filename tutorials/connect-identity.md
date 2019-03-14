In order to connect an Identity you have to create the provider and add a manager account.
To proceed with connecting an identity follow the steps below:

1. Connect and initialize BidiPass SDK

```javascript
const PROVIDER_ID = 'provider1';
const ACCOUNT_KEY = '0x5689fa7c97a8f8cf10975f6f453472f09e9c9928ac81799128fcb3da68773cf0'; // {Manager Account} credentials

const bidipass = require('bidipass-sdk'); // or require('./sdk/bidipass-loader.js');
const sdk = await bidipass(PROVIDER_ID, ACCOUNT_KEY);
```

2. Generate a new identity

```javascript
const UID = 'user1'; // User internal identifier
const CONNECT = 'http://127.0.0.1/bidipass/connect'; // Connect endpoint called by mobile app
const DISCONNECT = 'http://127.0.0.1/bidipass/disconnect'; // Disconnect endpoint called by mobile app
const USER_NAME = 'John Doe';

const user = sdk.identity.generate(UID, CONNECT, DISCONNECT);

// This will be used by BidiPass mobile apps to replace raw user IDs with a human readable identifier of the connected user.
user.custom.setDisplayName(USER_NAME); 
```

3. Create a QR code containing identity representation

```javascript
// To generate branded QR image as data URI scheme (data:image/png;base64,...)
// Use it on frontend: <img src="${qrDataURI}"/>
const qrDataURI = await user.qr(dataURI = true);

// ...or optionally send userRepr to frontend
// ...or generate QR code from backend by your own
const userRepr = user.serialize();
```

4. Receive identity response on connect endpoint (`CONNECT` used at step 2.)

```javascript
// You might use Express.js middleware to catch and validate payload
app.use('/bidipass/connect', sdk.identity.ThirdParty.Express.Middleware);

// ... in your controller
const user = request.$bidiPassIdentity;
```

5. Proceed with a test authorization

```javascript
await sdk.identity.whitelist(user);

try {
  // It will throw if failed or 120 seconds timeout exceeded
  await sdk.identity.testConnection(user);

  const authorization = sdk.identity.testConnection(user, 'Test connection');

  await authorization.dispatch();

  // To cancel it use: await authorization.request.cancel();
} catch (e) {
  await sdk.identity.unwhitelist(user);
}

const identityRepr = user.serialize();

// Save identityRepr somewhere safe.
// It's the identity passport within your platform.
```

**[NEXT](tutorial-2FA.html)**
