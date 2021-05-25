import React from "react";
import Draggable from "react-draggable";
import { submitHandlerCurry } from "./submitHandlerCurry";

import { sentenceCase } from "change-case";
import { titleCase } from "title-case";
import { InitialState } from "../Dapp";
import { Method } from "./renderArtifactAsUserInterface";
interface RenderContractMethodParams {
	 address: string;
	method: Method;
	buffer: JSX.Element[];
	state: InitialState;
	transactionHandler: Function;
}
export function renderContractMethod({
	 address,
	method,
	buffer,
	state,
	transactionHandler,
}: RenderContractMethodParams) {
	return (
		<Draggable key={method.name}>
			<form
				id={ address + "_" + method.name}
				// className="methodUi"
				onClick={openMethod}
				onSubmit={submitHandlerCurry({
					address,
					state,
					method,
					transactionHandler,
				})}
			>
				<button>{titleCase(sentenceCase(method.name))}</button>
				<ol>{buffer}</ol>
				{/* <textarea id={`${address}-${method.name}`}></textarea> */}
			</form>
		</Draggable>
	);
}

function openMethod(event: React.MouseEvent<HTMLFormElement, MouseEvent>) {
	const form = event.target as HTMLFormElement;
	console.log(`form`);
	form.classList.toggle(`open`);
	event.stopPropagation();
	// console.log();
}
