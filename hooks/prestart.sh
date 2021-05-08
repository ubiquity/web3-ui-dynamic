#!/bin/bash

cd ./blockchain/ || echo "ERROR: ./blockchain/ doesn't exist?"
yarn
yarn build # && yarn typechain "**/*.abi.json" --target=ethers-v5 # Typings generation breaks the build

cd ../frontend/ || echo "ERROR: ./frontend/ doesn't exist?"
yarn
yarn build

echo "prestart complete"