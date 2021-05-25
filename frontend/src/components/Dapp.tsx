import { ethers } from "ethers";
import React from "react";
import { ConnectWallet } from "./ConnectWallet";
import { Main } from "./Main";
import { NoWalletDetected } from "./NoWalletDetected";
import { genericTransactionHandler } from "./WriteContract/genericTransactionHandler";

import FullDeployment from "../../src/uad-contracts-deployment.json";

// const OLD_SCHEMA = `https://gist.githubusercontent.com/kamiebisu/fc4299819fd6eee7cdcc9534bdb8be76/raw/3e65c40932c9d99e423a120327efe5f079fc86e1/deploy-results.json`;

export type FullDeploymentType = typeof FullDeployment;
export type SingleDeploymentType = typeof FullDeployment.contracts.BondingShare; // JUST GRAB ONE // JUST REFERENCE TYPINGS
// export interface FullDeploymentType
// 	extends FullDeploymentType,
// 		Object {}
// export interface DeploymentResponseSingle
// 	extends SingleDeploymentType,
// 		Object {}

// type DeployedArtifact = typeof import("../../../contracts/aa.json"); // Artifact
declare global {
	interface Window {
		ethereum: any;
	}
}
const HARDHAT_NETWORK_ID = "31337";
// const CURRENT_NETWORK_ID = HARDHAT_NETWORK_ID; // @FIXME lol this should obviously not be hardcoded

type _SKM1<T, K extends keyof T, V> = { [k in K]: V };
type _SKM2<T, V> = _SKM1<T, keyof T, V>; // ALL KEYS
export type DeployedContracts = Partial<
	_SKM2<FullDeploymentType["contracts"], ethers.Contract>
>; // PARTIAL KEYS
export type DeployedContractName = keyof DeployedContracts;

export type InitialState = {
	provider: ethers.providers.Web3Provider | null;
	userWalletAddress: string | null;
	deployment: FullDeploymentType | null; // ARTIFACTS WITH ABIs
	contracts: DeployedContracts | null; // ETHERS.CONTRACTS
	transaction: string | null;
	write: any;
	errors: {
		transaction: string | null;
		network: string | null;
	};
};
export class Dapp extends React.Component {
	state: InitialState;

	constructor(props) {
		super(props);
		this.state = {
			provider: null,
			userWalletAddress: null,
			deployment: null, // ARTIFACTS WITH ABIs
			contracts: null, // ETHERS.CONTRACTS
			write: null,
			transaction: null,
			errors: {
				transaction: null,
				network: null,
			},
		};
	}

	render() {
		// NO WEB3
		if (window.ethereum === undefined) {
			return <NoWalletDetected />;
		}

		// WALLET NOT CONNECTED
		if (!this.state.userWalletAddress) {
			return (
				<ConnectWallet
					connectWallet={() => this._connectWallet()}
					networkError={this.state.errors.network}
					dismiss={() => this._dismissNetworkError()}
				/>
			);
		} else {
			// console.log(this.state);
			return <Main dapp={this} />;
		}

		// if (!this.state.tokenData || !this.state.balance) {
		// 	return <Loading />;
		// }
		// console.log(this.state);

		// if (!this.state.deployment) {
		// 	return <Loading />;
		// }
	}

	// componentWillUnmount() {
	// 	this._stopPollingData();
	// }

	async _connectWallet() {
		// THERES AN ASYNC ISSUE HERE
		const [userWalletAddress] = await window.ethereum.enable();
		if (!this._checkNetwork()) {
			return;
		}

		const deployResultsJsonURL =
			prompt(`Please provide a Deploy Results JSON URL to load the UI. Cancel to load the default deployment.`) ||
			false;

		const deployment = deployResultsJsonURL
			? await this.fetchRemoteDeployResults(deployResultsJsonURL)
			: FullDeployment;

		await this.loginUser(userWalletAddress, deployment);

		window.ethereum.on("accountsChanged", accountsChangedHandler);
		window.ethereum.on("chainChanged", networkChangedHandler);
		// debugger;

		function networkChangedHandler([newAddress]) {
			// this._stopPollingData();
			this._resetState();
		}
		async function accountsChangedHandler([newAddress]) {
			// this._stopPollingData();

			if (newAddress === undefined) {
				return this._resetState();
			}

			await this.loginUser(newAddress);
		}
	}

	async fetchRemoteDeployResults(deployResultsJsonURL: string) {
		const response = await fetch(
			deployResultsJsonURL
			// `https://gist.githubusercontent.com/kamiebisu/fc4299819fd6eee7cdcc9534bdb8be76/raw/3e65c40932c9d99e423a120327efe5f079fc86e1/deploy-results.json`
		);
		const parsed = (await response.json()) as FullDeploymentType;
		return parsed;
	}

	async loginUser(userWalletAddress: string, deployment: FullDeploymentType) {
		this.setState(await this._intializeEthers(deployment, userWalletAddress));
		// this._getTokenData();
		// this._startPollingData();
	}

	async _intializeEthers(
		fullDeployment: FullDeploymentType,
		userWalletAddress: string
	) {
		const stateInitialization = {
			provider: new ethers.providers.Web3Provider(window.ethereum),
			contracts: {},
			deployment: fullDeployment,
			userWalletAddress,
		};

		const contracts = fullDeployment.contracts;

		for (const contractName in contracts) {
			const contract = contracts[contractName];
			stateInitialization.contracts[contractName] = new ethers.Contract(
				contract.address,
				contract.abi,
				stateInitialization.provider.getSigner()
			);
		}

		return stateInitialization;
	}

	// _startPollingData() {
	// 	this._pollDataInterval = setInterval(() => {
	// 		this._updateBalance();
	// 		// console.log(`updating`);
	// 	}, 1000);
	// 	this._updateBalance();
	// }

	// _stopPollingData() {
	// 	clearInterval((this._pollDataInterval as any) as number);
	// 	this._pollDataInterval = undefined;
	// }
	// async _getTokenData(tokenContractAddress: DeploymentAddress) {
	// 	const name = await this.state.contracts[tokenContractAddress]?.name();
	// 	const symbol = await this.state.contracts[tokenContractAddress]?.symbol();
	// 	this.setState({ tokenData: { name, symbol } });
	// }

	// async _updateBalance(tokenContractAddress: DeploymentAddress) {
	// 	const balance = await this.state.contracts[tokenContractAddress]?.balanceOf(
	// 		this.state.userWalletAddress
	// 	);
	// 	// console.log(ethers.utils.formatEther(balance));
	// 	// debugger;
	// 	this.setState({ balance });
	// }

	_dismissTransactionError() {
		this.setState({ errors: { transaction: null } });
	}

	_dismissNetworkError() {
		this.setState({ errors: { network: null } });
	}

	_getRpcErrorMessage(error) {
		if (error.data) {
			return error.data.message;
		} else {
			return error.message;
		}
	}

	_resetState() {
		this.setState({});
	}

	_checkNetwork() {
		if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
			return true;
		}

		this.setState({
			networkError: "Please connect Metamask to Localhost:8545",
		});

		return false;
	}
	transactionHandler(
		address: DeployedContractName,
		dapp: Dapp
	): (method: any, ...args: any[]) => Promise<any> {
		return async (method, ...args) => {
			if (!this.state.contracts) {
				throw new Error(`contracts not initialized in state`);
			}
			const contractName = Object.keys(this.state.contracts).filter(ctrName => {
				if (this.state.contracts) {
					return this.state.contracts[ctrName].address === address
				}
				return false
			});
			const selectedContract =this.state.contracts[contractName[0]]
			if (selectedContract) {
				return await genericTransactionHandler.apply(dapp, [
					selectedContract,
					method,
					...args,
				]);
			} else {
				throw new Error(`Contract not found in deployment for ${address}`);
			}
		};
	}
}
