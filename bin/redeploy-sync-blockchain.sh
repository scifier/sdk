#!/bin/bash

BLOCKCHAIN_DIR="../blockchain"
WORKING_DIR=$(pwd)

if [ -d "$BLOCKCHAIN_DIR/build" ]; then
  echo "Back up initial blockchain artifacts"
  mv "$BLOCKCHAIN_DIR/build" "$BLOCKCHAIN_DIR/build-bck-sdk"
fi

cd "$BLOCKCHAIN_DIR"
truffle migrate --reset --network development
cd "$WORKING_DIR"
./bin/sync-blockchain.sh

if [ -d "$BLOCKCHAIN_DIR/build-bck-sdk" ]; then
  echo "Restore initial blockchain artifacts"
  rm -rf "$BLOCKCHAIN_DIR/build"
  mv "$BLOCKCHAIN_DIR/build-bck-sdk" "$BLOCKCHAIN_DIR/build"
fi
