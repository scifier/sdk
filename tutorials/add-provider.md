In order to add a provider and make possible managing it, please follow the steps below:

1. Add provider to the blockchain

```bash
$(npm bin)/bidipass provider add provider1 \
  -k '0x3918997b7df8ac725a70e2d012f67d32065b8466485dcbf7794031313b1db540' \
    -n 'Test Platform' \
      -d 'Test Platform' \
        -w 'http://127.0.0.1' \
          -i 'https://bidipass.org/img/logo.png'
```

> `0x3918997b7df8ac725a70e2d012f67d32065b8466485dcbf7794031313b1db540` is BidiPass Admin private key.

Sample Output:

```bash
--> Provider provider1
--> Create provider contract
--> Provider contract created at 0x5e80f8cAB66617E91EB03377E0D440b1322EC0e4

{Owner Account}
Address: 0x49D62a06F8462eE27eF1Ed5AfDA3B1d0b0fB6388
Private Key: 0xf1e8513ca18280e2ac0874a08c88644666a7487014f258f50cbc6143f30ae5cb
```

> Owner account is used to manage the provider

2. Add a manager (or more)

```bash
$(npm bin)/bidipass provider manager add provider1 \
  -k '0xf1e8513ca18280e2ac0874a08c88644666a7487014f258f50cbc6143f30ae5cb'
```

> `0xf1e8513ca18280e2ac0874a08c88644666a7487014f258f50cbc6143f30ae5cb` is the Provider owner private key created at step 1.

Sample Output:

```bash
--> Provider provider1
--> Adding manager to provider contract at 0x5e80f8cAB66617E91EB03377E0D440b1322EC0e4

{Manager Account}
Address: 0x6C5EfEd5ADfCe6A6830bCB8c287Fa0B7cDcEb4B4
Private Key: 0x5689fa7c97a8f8cf10975f6f453472f09e9c9928ac81799128fcb3da68773cf0
```

> Provider Manager account is used to perform authorization actions and to add users (it might be used programatically, e.g. by SDK)

3. Test if connection works well

```bash
$(npm bin)/bidipass provider healthcheck provider1 \
  -k '0x5689fa7c97a8f8cf10975f6f453472f09e9c9928ac81799128fcb3da68773cf0'
```

> You should see no errors while command running

**[NEXT](tutorial-connect-identity.html)**
