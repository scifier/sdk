# BidiPass NodeJS SDK

[BidiPass](https://bidipass.org) is an identity authentication protocol 
designed to strengthen today’s KYC model that global 
businesses depend on.

This repository contains BidiPass NodeJS SDK.

## Prerequisites

- [ ] `Node.JS` >=v8
- [ ] `ganache-cli` *(development only)*
- [ ] `truffle` *(development only)*

## Installation

  - `npm install @bidipass/sdk`

## Documentation

  - [Home](https://bidipasscompany.github.io/sdk/)
  - [SDK Integration](https://bidipasscompany.github.io/sdk/tutorial-index_.html)

## Command Line Tool

Usage:
  - `$(npm bin)/bidipass --help`

```bash
alexanderc@MacBook-Pro:~/Desktop/Projects/exchange$ $(npm bin)/bidipass --help
bidipass <command>

Commands:
  bidipass admin <command>     Manage admins
  bidipass fake-identity       Fake an identity
  bidipass generate-account    Generate new blockchain account
  bidipass info                Show distribution information
  bidipass provider <command>  Manage providers

Options:
  --key, -k      BidiPass private key
  -h, --help     Show help                                             [boolean]
  -v, --version  Show version number                                   [boolean]

Copyright BidiPass 2018
```

> Commands are nested, e.g. `$(npm bin)/bidipass provider manager add`. You can write `--help` to see information about every command.

## Development

Installation:
  - `npm install`

Running Tests:
  - `cd ../blockchain`
  - `npm run rpc`
  - `cd ../sdk`
  - `npm init-dev`
  - `npm test`

> In order to debug please add `DEBUG='@bidipass/sdk:*'` when running `npm test`. This feature is using [debug](https://www.npmjs.com/package/debug) package; please refer to it when using.

> Another option to generate dump QR code for an identity in working directory is adding `BIDIPASS_DUMP_QR=1` environment variable when running tests.

Release:
  - Deploy blockchain using `npm run migrate` *(production)*
  - `npm run init`
  - `npm run docs`
  - `npm pack` or `npm publish`

> `npm run init` synchronizes network configuration file (`blockchain/truffle.json`), which contains default network setup used by clients. 
> **Be very careful with this as it is being used in production!**
