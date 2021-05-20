#!/bin/bash
if [ -f ./contracts/.env ]
then
  echo "DDDDDYOKL"
  export $(cat ./contracts/.env | sed 's/#.*//g' | xargs)
fi

cd ./contracts || echo "ERROR: ./contracts/ doesn't exist?"
kill $(lsof -t -i:8545) || true
echo "YOKL"
echo $ALCHEMY_API_KEY
echo "YOKL"
yarn hardhat node --fork https://eth-mainnet.alchemyapi.io/v2/$ALCHEMY_API_KEY --fork-block-number 12150000 --show-accounts --export-all ../frontend/src/uad-contracts-deployment.json > node.log 2>&1 &
sleep 10
while : ; do
    [[ -f "./frontend/src/uad-contracts-deployment.json" ]] && break
    echo "Pausing until uad-contracts-deployment.json exists."
    sleep 1
done

# yarn hardhat --network localhost run scripts/deploy-entry.ts   # we need a standardized way to hit the deployment scripts before this works seamlessly
# yarn hardhat --network localhost run deploy/*.ts & # needs to be daemonized to be able to automatically continue opening the UI
# yarn hardhat --network localhost run deploy/00*.ts
# for f in "$my_dir"*."$ext"; do echo $f; done
# for deployScript in deploy/*.ts; do
#     yarn hardhat --network localhost run "$deployScript"
#  done

#  yarn hardhat deploy --export ../frontend/src/uad-contracts-deployment.json