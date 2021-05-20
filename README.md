# dynamic-uad-ui

after git clone the project make sure to run

`$ git submodule update --init --recursive --remote`

You need to create `.env` file inside the contracts folder with at least the ALCHEMY_API_KEY filled.

then run `$ yarn start`

it will launch a local node on port **8545** you can check the log in the root file `local.node.log`
after the node is launched it will build and run the front on port **3000**
