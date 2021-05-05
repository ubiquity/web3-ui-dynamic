#!/bin/bash

cd ./blockchain/ || echo "ERROR: ./blockchain/ doesn't exist?"
# ln -s ../tsconfig.json ./
yarn
yarn build

cd ../frontend/ || echo "ERROR: ./frontend/ doesn't exist?"
# ln -s ../tsconfig.json ./
yarn
yarn build

echo "post install complete"