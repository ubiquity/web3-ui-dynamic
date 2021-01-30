import { renderArtifactAsUserInterface } from "./renderArtifactAsUserInterface";
import React from "react";
import { WriteContractParams } from "./@types";
export function WriteContract({ abi, contract, state, genericTransactionHandler }: WriteContractParams) {
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
