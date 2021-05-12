#!/bin/bash

cd ./contracts || echo "ERROR: ./contracts/ doesn't exist?"
kill $(lsof -t -i:8545) || true
yarn hardhat node &
# yarn hardhat --network localhost run scripts/deploy-entry.ts   # we need a standardized way to hit the deployment scripts before this works seamlessly
# yarn hardhat --network localhost run deploy/*.ts & # needs to be daemonized to be able to automatically continue opening the UI
# yarn hardhat --network localhost run deploy/00*.ts
# for f in "$my_dir"*."$ext"; do echo $f; done
for deployScript in deploy/*.ts; do
    yarn hardhat --network localhost run "$deployScript"
done

yarn hardhat deploy --export ../frontend/src/uad-contracts-deployment.json