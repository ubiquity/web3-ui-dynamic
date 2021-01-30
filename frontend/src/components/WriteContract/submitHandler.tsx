import { Contract } from "ethers";
import React from "react";
import { iterateInputs } from "./iterateInputs";

interface SubmitHandlerParams {
	event: React.FormEvent<HTMLFormElement>;
	contract: Contract;
	method: string;
	genericTransactionHandler;
}

export async function submitHandler({ event, contract, method, genericTransactionHandler }: SubmitHandlerParams) {
	event.preventDefault();
	const form = document.forms[method];
	const params = [] as any[];
	for (const input of form) {
		iterateInputs({ input, params });
	}
	// debugger;

	// console.log({ params });

	// const response = await contract[method].apply(null, params);
	const response = await genericTransactionHandler.apply(null, [method, ...params]);
	console.log({ response });
	return response;
}
