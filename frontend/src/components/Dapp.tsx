import { BigNumberish, ethers } from "ethers";
import React from "react";

import contractAddress from "../contracts/contract-address.json";
import TokenArtifact from "../contracts/SBToken.json";

import { ConnectWallet } from "./ConnectWallet";
import { Loading } from "./Loading";
import { Main } from "./Main";
import { NoWalletDetected } from "./NoWalletDetected";
import { genericTransactionHandler } from "./WriteContract/genericTransactionHandler";

const HARDHAT_NETWORK_ID = "31337";

export const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

declare global {
	interface Window {
		ethereum: any;
	}
}

export type InitialState = {
	tokenData?: { name: string; symbol: string };
	selectedAddress?: string;
	balance?: any;
	txBeingSent?: string;
	transactionError?: string;
	networkError?: string;
	writeContract?: any;
	readData?: { [key: string]: any }; // ASSOCIATED WITH EACH FORM ID
	// for (const method of TokenArtifact.abi) {
	// TODO DYNAMIC TYPINGS GENERATION ITERATE THROUGH ARRAY OF FUNCTION NAMES
	// type methods = TokenArtifact.abi.filter((e) => !!e.name);
	// }
};

export const renderBalance = (_balance: BigNumberish) => {
	const balance = ethers.utils.formatEther(_balance).toString();
	return balance.substring(0, balance.indexOf(`.`) + 3);
};

// interface Test2 extends ethers.Contract extends {balanceOf: any}
export class Dapp extends React.Component {
	state: InitialState;
	_pollDataInterval?: NodeJS.Timeout;
	_provider?: ethers.providers.Web3Provider;
	_contract!: ethers.Contract;

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		if (window.ethereum === undefined) {
			return <NoWalletDetected />;
		}

		if (!this.state.selectedAddress) {
			return <ConnectWallet connectWallet={() => this._connectWallet()} networkError={this.state.networkError} dismiss={() => this._dismissNetworkError()} />;
		}

		if (!this.state.tokenData || !this.state.balance) {
			return <Loading />;
		}

		return <Main dapp={this} />;
	}

	componentWillUnmount() {
		this._stopPollingData();
	}

	async _connectWallet() {
		const [selectedAddress] = await window.ethereum.enable();

		if (!this._checkNetwork()) {
			return;
		}

		this._initialize(selectedAddress);

		window.ethereum.on("accountsChanged", ([newAddress]) => {
			this._stopPollingData();

			if (newAddress === undefined) {
				return this._resetState();
			}

			this._initialize(newAddress);
		});

		window.ethereum.on("networkChanged", ([networkId]) => {
			this._stopPollingData();
			this._resetState();
		});
	}

	_initialize(userAddress) {
		this.setState({
			selectedAddress: userAddress,
		});

		this._intializeEthers();
		this._getTokenData();
		this._startPollingData();
	}

	async _intializeEthers() {
		this._provider = new ethers.providers.Web3Provider(window.ethereum);
		this._contract = new ethers.Contract(contractAddress.Token, TokenArtifact.abi, this._provider.getSigner());
	}

	_startPollingData() {
		this._pollDataInterval = setInterval(() => {
			this._updateBalance();
			// console.log(`updating`);
		}, 1000);
		this._updateBalance();
	}

	_stopPollingData() {
		clearInterval((this._pollDataInterval as any) as number);
		this._pollDataInterval = undefined;
	}
	async _getTokenData() {
		const name = await this._contract?.name();
		const symbol = await this._contract?.symbol();
		this.setState({ tokenData: { name, symbol } });
	}

	async _updateBalance() {
		// debugger;
		const balance = await this._contract.balanceOf(this.state.selectedAddress);
		// console.log(ethers.utils.formatEther(balance));
		// debugger;
		this.setState({ balance });
	}

	_dismissTransactionError() {
		this.setState({ transactionError: undefined });
	}

	_dismissNetworkError() {
		this.setState({ networkError: undefined });
	}

	_getRpcErrorMessage(error) {
		if (error.data) {
			return error.data.message;
		}

		return error.message;
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
	_genericTransactionHandler(dapp: Dapp): Function {
		return async (method, ...args) => {
			return await genericTransactionHandler.apply(dapp, [method, ...args]);
		};
	}
}
