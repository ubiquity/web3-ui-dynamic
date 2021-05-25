import React from "react";
import { iterateInputs } from "./iterateInputs";

interface SubmitHandlerParams {
	address: string;
	event: React.FormEvent<HTMLFormElement>;
	methodName: string;
	transactionHandler;
}

export async function submitHandler({
	address,
	event,
	methodName: method,
	transactionHandler,
}: SubmitHandlerParams) {
	event.preventDefault();
	const form = document.forms[address+"_"+method];
	const params = [] as any[];
	for (const input of form) {
		iterateInputs({ input, params });
	}
	const response = await transactionHandler.apply(null, [method, ...params]);
	console.log({ response });
	return response;
}
