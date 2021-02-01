import React from "react";
import Draggable from "react-draggable";
import { submitHandlerCurry } from "./submitHandlerCurry";

import { sentenceCase } from "change-case";
import { titleCase } from "title-case";

export function renderMethodForm({
	method,
	buffer,
	contract,
	state,
	genericTransactionHandler,
}) {
	return (
		<Draggable key={method.name}>
			<form
				id={method.name}
				className="methodUi"
				onSubmit={submitHandlerCurry({
					state,
					contract,
					method,
					genericTransactionHandler,
				})}
			>
				<button>{titleCase(sentenceCase(method.name))}</button>
				<ol>{buffer}</ol>
				<textarea></textarea>
			</form>
		</Draggable>
	);
}
