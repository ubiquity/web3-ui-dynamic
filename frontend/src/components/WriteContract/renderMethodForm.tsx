import React from "react";
import Draggable from "react-draggable";
import { RenderParams } from "./@types";
import { submitHandlerCurry } from "./submitHandlerCurry";

import { sentenceCase } from "change-case";
import { titleCase } from "title-case";

export function renderMethodForm({ method, buffer, contract, state, genericTransactionHandler }: RenderParams) {
	return (
		<Draggable key={method.name}>
			<form
				id={method.name}
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
