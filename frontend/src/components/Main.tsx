import React from "react";
import Deployment from "../@types/deployment.json"; // REFERENCE TYPING
import { Dapp, DeploymentAddress, InitialState } from "./Dapp";
import { renderArtifactAsUserInterface } from "./WriteContract/renderArtifactAsUserInterface";

export function Main({ dapp }: { dapp: Dapp }) {
	const state = dapp.state as InitialState;
	let contractsUI = [] as any[];

	if (!state.contracts) {
		throw new Error("no state.contracts");
		// console.log(state);
		// debugger;
	}
	//  else {
	// debugger;
	// }

	for (const address in state.contracts) {
		const abi = (state.deployment as typeof Deployment)[address].abi;
		const contract = state.contracts[address];
		contractsUI.push(
			renderArtifactAsUserInterface({
				abi,
				contract,
				state: state,
				genericTransactionHandler: dapp._genericTransactionHandler(
					address as DeploymentAddress,
					dapp
				),
			})
		);
	}

	// console.log({ contractsUI, contracts: state.contracts });

	return <div>{contractsUI}</div>;
	// return [common(dapp), contractsUI];
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
