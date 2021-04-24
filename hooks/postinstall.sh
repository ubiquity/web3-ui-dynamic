#!/bin/bash

cd ./blockchain/ || echo "ERROR: ./blockchain/ doesn't exist?"
yarn
yarn build

echo "post install complete"