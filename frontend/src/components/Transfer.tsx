import React from "react";

export function Transfer({ transferTokens, tokenSymbol }) {
	return (
		<div>
			<h4>Transfer</h4>
			<form
				onSubmit={(event) => {
					// This function just calls the transferTokens callback with the
					// form's data.
					event.preventDefault();

					// @ts-ignore
					const formData = new FormData(event.target);
					const to = formData.get("to");
					const amount = formData.get("amount");

					if (to && amount) {
						transferTokens(to, amount);
					}
				}}
			>
				<div>
					<input type="number" step="0.00000000000000001" name="amount" placeholder="1" required />
					<label>Amount of {tokenSymbol}</label>
				</div>
				<div>
					<input type="text" name="to" required />
					<label>Recipient address</label>
				</div>
				<div>
					<input type="submit" value="Transfer" />
				</div>
			</form>
		</div>
	);
}
