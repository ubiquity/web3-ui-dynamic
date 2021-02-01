import React from "react";

import { NetworkErrorMessage } from "./NetworkErrorMessage";

export function ConnectWallet({ connectWallet, networkError, dismiss }) {
	return (
		<div>
			<div>
				{/* Metamask network should be set to Localhost:8545. */}
				{networkError && (
					<NetworkErrorMessage message={networkError} dismiss={dismiss} />
				)}
			</div>
			<div>
				<button id="connect" type="button" onClick={connectWallet}>
					Connect Wallet
				</button>
			</div>
		</div>
	);
}
