import React from "react";
import Deployment from "../@types/deployment.json"; // REFERENCE TYPING
import {
	Dapp,
	DeployedContractAddress,
	DeploymentResponseSingle,
	InitialState,
} from "./Dapp";
import { renderContract } from "./WriteContract/renderArtifactAsUserInterface";

export function Main({ dapp }: { dapp: Dapp }) {
	const state = dapp.state as InitialState;
	const protocolUi = [] as (JSX.Element | JSX.Element[])[];

	if (!state.contracts) {
		throw new Error("no state.contracts");
	}

	for (const singleDeploymentAddress in state.deployment) {
		const address = singleDeploymentAddress as DeployedContractAddress;
		const singleDeployment = (state.deployment as typeof Deployment)[
			address
		] as DeploymentResponseSingle;

		protocolUi.push(
			renderContract({
				singleDeploymentAbi: singleDeployment.abi,
				singleDeploymentAddress: address,
				state,
				transactionHandler: dapp.transactionHandler(address, dapp),
			})
		);
	}

	return <div>{protocolUi}</div>;
}

// function common(dapp) {
// 	return (
// 		<main>
// 			<div>
// 				{state.transaction && (
// 					<WaitingForTransactionMessage txHash={state.transaction} />
// 				)}
// 				{state.errors.transaction && (
// 					<TransactionErrorMessage
// 						message={dapp._getRpcErrorMessage(state.errors.transaction)}
// 						dismiss={() => dapp._dismissTransactionError()}
// 					/>
// 				)}
// 			</div>
// 			<div>
// 				{state.write && (
// 					<textarea
// 						defaultValue={JSON.stringify(state.write, null, " ")}
// 					></textarea>
// 				)}
// 			</div>
// 		</main>
// 	);
// }
