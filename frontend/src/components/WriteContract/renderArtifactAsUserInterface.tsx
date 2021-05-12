import React from "react";
import {
	DeployedContractName,
	SingleDeploymentType,
	InitialState,
} from "../Dapp";
import { listInputItem as inputItem } from "./listInputItem";
import { renderContractMethod } from "./renderMethodForm";
interface Params {
	singleDeploymentAbi: SingleDeploymentType["abi"];
	singleDeploymentName: DeployedContractName;
	state: InitialState;
	transactionHandler: Function;
}
export function renderContract({
	singleDeploymentAbi,
	singleDeploymentName,
	state,
	transactionHandler,
}: Params) {
	const attributes = {
		className: "contract",
		id: singleDeploymentName,
		key: singleDeploymentName,
	};

	return (
		<div {...attributes}>
			{
				singleDeploymentAbi
					.map(
						_mapping({
							state,
							transactionHandler,
							address: singleDeploymentName,
						})
					)
					.filter(Boolean) as JSX.Element[]
			}
		</div>
	);
}

export interface Method {
	type: string;
	inputs: any;
	name: string;
}
interface MappingParams {
	state: InitialState;
	transactionHandler: Function;
	address: DeployedContractName;
}

function _mapping({ state, transactionHandler, address }: MappingParams) {
	return function mapping(
		contractMethod: Method | any
	): JSX.Element | undefined {
		if (contractMethod?.type !== "function") {
			return;
		}

		const contractMethodInputRender = [] as JSX.Element[];

		for (const param of contractMethod.inputs) {
			contractMethodInputRender.push(inputItem(param));
		}

		if (contractMethodInputRender.length) {
			return renderContractMethod({
				address,
				method: contractMethod,
				buffer: contractMethodInputRender,
				state,
				transactionHandler,
			});
		}
		// else {
		// 	return false;
		// }
	};
}
