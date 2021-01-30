import { ethers } from "ethers";
import React from "react";
import TokenArtifact from "../contracts/BondingShare.json";
import { Dapp, renderBalance } from "./Dapp";
import { NoTokensMessage } from "./NoTokensMessage";
import { TransactionErrorMessage } from "./TransactionErrorMessage";
import { WaitingForTransactionMessage } from "./WaitingForTransactionMessage";
import { WriteContract } from "./WriteContract/WriteContract";

export function Main({ dapp }: { dapp: Dapp }) {
	return (
		<main>
			<div>
				<h1>
					{dapp.state.tokenData?.name} ({dapp.state.tokenData?.symbol})
				</h1>
				<h2>Contract Debug UI</h2>
				<h3 style={{ textTransform: "initial" }}>
					Welcome {dapp.state.selectedAddress}, you have {renderBalance(dapp.state.balance)} {dapp.state.tokenData?.symbol}
				</h3>
			</div>

			<div>
				{dapp.state.txBeingSent && <WaitingForTransactionMessage txHash={dapp.state.txBeingSent} />}

				{dapp.state.transactionError && <TransactionErrorMessage message={dapp._getRpcErrorMessage(dapp.state.transactionError)} dismiss={() => dapp._dismissTransactionError()} />}
			</div>

			<div>
				{dapp.state.writeContract && <textarea defaultValue={JSON.stringify(dapp.state.writeContract, null, " ")}></textarea>}

				<WriteContract abi={TokenArtifact.abi} contract={dapp._contract as ethers.Contract} state={dapp.state} genericTransactionHandler={dapp._genericTransactionHandler(dapp)} />
			</div>

			<div>{dapp.state.balance?.eq(0) && <NoTokensMessage selectedAddress={dapp.state.selectedAddress} />}</div>
		</main>
	);
}
