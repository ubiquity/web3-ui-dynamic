import React from "react";

export function NetworkErrorMessage({ message, dismiss }) {
	return (
		<div role="alert">
			{message}
			<button data-dismiss="alert" aria-label="Close" onClick={dismiss}>
				<span aria-hidden="true">&times;</span>
			</button>
		</div>
	);
}
