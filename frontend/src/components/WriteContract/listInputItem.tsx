import { sentenceCase } from "change-case";
import React from "react";
import { titleCase } from "title-case";

export function listInputItem(param: { name: any; internalType: string }) {
	return (
		<li key={param.name}>
			<input
				required
				key={`${param.name}_${param.internalType}_`}
				data-type={param.internalType}
				type={param.internalType.includes(`int`) ? "number" : "text"}
				placeholder={titleCase(sentenceCase(param.name))}
			/>
		</li>
	);
}
