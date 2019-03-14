#!/usr/bin/env node

const ALLOWED_CONTRACTS = [ /^(authorization|platform|reward|bdp)/i ];
const ALLOWED_KEYS = [ 'abi', 'contractName', 'networks' ];

const path = require('path');
const fs = require('fs');

const artifactsDir = path.resolve(__dirname, '../artifacts');
const originalTruffleConfigFile = path.join(artifactsDir, 'truffle.js');
const truffleConfigFile = path.join(artifactsDir, 'truffle.json');

console.info(`Cleanup artifacts from ${ artifactsDir }`);

const artifacts = fs.readdirSync(artifactsDir).filter(f => /\.json$/.test(f));

for (const file of artifacts) {
  const artifactFile = path.join(artifactsDir, file);
  const match = ALLOWED_CONTRACTS.map(regex => regex.test(file)).filter(Boolean).length > 0;

  if (!match) {
    console.info(`Remove unused ${ artifactFile }`);
    fs.unlinkSync(artifactFile);
    continue;
  }

  const content = {};
  const artifact = JSON.parse(fs.readFileSync(artifactFile));

  for (const key of ALLOWED_KEYS) {
    content[key] = artifact.hasOwnProperty(key) ? artifact[key] : null;
  }

  console.info(`Cleanup ${ artifactFile }`);

  fs.writeFileSync(artifactFile, JSON.stringify(content, null, '  '));
}

if (fs.existsSync(originalTruffleConfigFile)) {
  console.info(`Optimize Truffle config ${ originalTruffleConfigFile }`);

  const truffleConfig = require(originalTruffleConfigFile);

  fs.writeFileSync(truffleConfigFile, JSON.stringify(truffleConfig, null, '  '));
  fs.unlinkSync(originalTruffleConfigFile);
}
