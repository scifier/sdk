In order to proceed to connect to BidiPass testnet blockchain you need to pass an additional parameter:

```javascript
const PROVIDER_ID = 'provider1';
const ACCOUNT_KEY = '0x5689fa7c97a8f8cf10975f6f453472f09e9c9928ac81799128fcb3da68773cf0'; // {Manager Account} credentials

const bidipass = require('@bidipass/sdk'); // or require('./sdk/bidipass-loader.js');
const sdk = await bidipass(PROVIDER_ID, ACCOUNT_KEY, 'testnet');
```
