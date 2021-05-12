import React from "react";
// import Deployment from "../@types/deployment.json"; // REFERENCE TYPING
import {
	Dapp,
	DeployedContractName,
	SingleDeploymentType,
	InitialState,
} from "./Dapp";
import { renderContract } from "./WriteContract/renderArtifactAsUserInterface";

export function Main({ dapp }: { dapp: Dapp }) {
	const state = dapp.state as InitialState;
	const protocolUi = [] as (JSX.Element | JSX.Element[])[];

	if (!state.contracts) {
		throw new Error("no state.contracts");
	}

	for (const singleDeploymentName in state.deployment?.contracts) {
		const singleDeployment: SingleDeploymentType =
			state.deployment?.contracts[singleDeploymentName];

		const address = singleDeployment.address as DeployedContractName;
		// const singleDeployment = (state.deployment as typeof Deployment)[
		// 	address
		// ] as SingleDeploymentType;

		protocolUi.push(
			renderContract({
				singleDeploymentAbi: singleDeployment.abi,
				singleDeploymentName: address,
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
