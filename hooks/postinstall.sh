#!/bin/bash

rm ./hardhat.config.ts
ln -s ./blockchain/hardhat.config.ts ./

rm ./tsconfig.json
ln -s ./blockchain/tsconfig.json ./

echo "post install complete"