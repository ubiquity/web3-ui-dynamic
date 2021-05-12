#!/bin/bash

cd ./contracts/ || echo "ERROR: ./contracts/ doesn't exist?"
yarn
yarn compile # && yarn typechain "**/*.abi.json" --target=ethers-v5 # Typings generation breaks the build

cd ../frontend/ || echo "ERROR: ./frontend/ doesn't exist?"
yarn
yarn build

echo "prestart complete"