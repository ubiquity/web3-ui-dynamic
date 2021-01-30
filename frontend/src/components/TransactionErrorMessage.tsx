import React from "react";

export function TransactionErrorMessage({ message, dismiss }) {
	return (
		<div role="alert">
			<p>Error sending transaction</p>
			<code>{message}</code>
			<button data-dismiss="alert" aria-label="Close" onClick={dismiss}>
				<span aria-hidden="true">&times;</span>
			</button>
		</div>
	);
}
