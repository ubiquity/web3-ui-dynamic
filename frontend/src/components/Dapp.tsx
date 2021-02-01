import { ethers } from "ethers";
import React from "react";
import Deployment from "../@types/deployment.json"; // REFERENCE TYPING
import { ConnectWallet } from "./ConnectWallet";
import { Loading } from "./Loading";
import { Main } from "./Main";
import { NoWalletDetected } from "./NoWalletDetected";
import { genericTransactionHandler } from "./WriteContract/genericTransactionHandler";
declare global {
	interface Window {
		ethereum: any;
	}
}
const HARDHAT_NETWORK_ID = "31337";

type _SKM1<T, K extends keyof T, V> = { [k in K]: V };
type _SKM2<T, V> = _SKM1<T, keyof T, V>; // ALL KEYS
type DeploymentContracts = Partial<_SKM2<typeof Deployment, ethers.Contract>>; // PARTIAL KEYS
export type DeploymentAddress = keyof DeploymentContracts;

export type InitialState = {
	userWalletAddress: string | null;
	deployment: typeof Deployment | null; // ARTIFACTS WITH ABIs
	contracts: DeploymentContracts | null; // ETHERS.CONTRACTS
	// network: {
	transaction: string | null;
	write: any;
	errors: {
		transaction: string | null;
		network: string | null;
	};
	// };
};

// export const renderBalance = (_balance: BigNumberish) => {
// 	const balance = ethers.utils.formatEther(_balance).toString();
// 	return balance.substring(0, balance.indexOf(`.`) + 3);
// };

export class Dapp extends React.Component {
	state: InitialState;
	_provider?: ethers.providers.Web3Provider;

	constructor(props) {
		super(props);
		this.state = {
			userWalletAddress: null,
			deployment: null, // ARTIFACTS WITH ABIs
			contracts: null, // ETHERS.CONTRACTS
			// network: {
			write: null,
			transaction: null,
			errors: {
				transaction: null,
				network: null,
			},
			// },
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
			// console.trace(this);
			return <Main dapp={this} />;
		}

		// if (!this.state.tokenData || !this.state.balance) {
		// 	return <Loading />;
		// }
		// console.trace(this.state);

		// if (!this.state.deployment) {
		// 	return <Loading />;
		// }
	}

	// componentWillUnmount() {
	// 	this._stopPollingData();
	// }

	async _connectWallet() {
		// console.trace();
		const [userWalletAddress] = await window.ethereum.enable();
		if (!this._checkNetwork()) {
			return;
		}

		this.state.deployment = (await fetchRemoteDeployResults()) || Deployment;

		this._initialize(userWalletAddress);

		async function fetchRemoteDeployResults() {
			const response = await fetch(
				`https://gist.githubusercontent.com/kamiebisu/fc4299819fd6eee7cdcc9534bdb8be76/raw/3e65c40932c9d99e423a120327efe5f079fc86e1/deploy-results.json`
			);
			const parsed = (await response.json()) as typeof Deployment;
			return parsed;
		}

		window.ethereum.on("accountsChanged", ([newAddress]) => {
			// this._stopPollingData();

			if (newAddress === undefined) {
				return this._resetState();
			}

			this._initialize(newAddress);
		});

		window.ethereum.on("networkChanged", ([networkId]) => {
			// this._stopPollingData();
			this._resetState();
		});
	}

	_initialize(userAddress: string) {
		this.setState({
			userWalletAddress: userAddress,
		});

		this._intializeEthers();
		// this._getTokenData();
		// this._startPollingData();
	}

	async _intializeEthers() {
		this._provider = new ethers.providers.Web3Provider(window.ethereum);

		// this.state.contracts = this.state.contracts || {};
		this.state.contracts = {};

		for (const address in this.state.deployment) {
			const contract = this.state.deployment[
				address
			] as typeof import("../contracts/BondingShare.json"); // Artifact

			this.state.contracts[address] = new ethers.Contract(
				address,
				contract.abi,
				this._provider.getSigner()
			);
		}
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
	_genericTransactionHandler(
		address: DeploymentAddress,
		dapp: Dapp
	): (method: any, ...args: any[]) => Promise<any> {
		return async (method, ...args) => {
			if (!this.state.contracts) {
				throw new Error(`contracts not initialized in state`);
			}
			const selectedContract = this.state.contracts[address];
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
