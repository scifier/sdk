#!/bin/bash

function error() {
  echo "ERROR: $1"
  exit 1
}

CONTRACTS_DIR="../blockchain/build/contracts"
TRUFFLE_CONFIG="../blockchain/truffle.js"

if [ ! -d "$CONTRACTS_DIR" ]; then
  error "You should deploy contracts first." 
elif [ ! -f "$TRUFFLE_CONFIG" ]; then
  error "Missing truffle config." 
fi

rm -rf artifacts/
cp -R "$CONTRACTS_DIR/" artifacts/
./bin/cleanup-artifacts.js
cp "$TRUFFLE_CONFIG" artifacts/truffle.js
