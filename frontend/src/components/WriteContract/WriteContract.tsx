import { renderArtifactAsUserInterface } from "./renderArtifactAsUserInterface";
import React from "react";
export function WriteContract({ abi, contract, state, genericTransactionHandler }) {
	return (
		<div id="methodUi">
			{renderArtifactAsUserInterface({
				abi,
				contract,
				state,
				genericTransactionHandler,
			})}
		</div>
	);
}
