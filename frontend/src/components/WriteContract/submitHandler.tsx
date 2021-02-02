import React from "react";
import { iterateInputs } from "./iterateInputs";

interface SubmitHandlerParams {
	event: React.FormEvent<HTMLFormElement>;
	methodName: string;
	transactionHandler;
}

export async function submitHandler({
	event,
	methodName: method,
	transactionHandler,
}: SubmitHandlerParams) {
	event.preventDefault();
	const form = document.forms[method];
	const params = [] as any[];
	for (const input of form) {
		iterateInputs({ input, params });
	}
	const response = await transactionHandler.apply(null, [method, ...params]);
	console.log({ response });
	return response;
}
