import { Web3Provider } from "ethers/dist/ethers.esm";
import React from "react";
import ReactDOM from "react-dom";
import { Dapp } from "./components/Dapp";
import "./design/base.css";
import "./design/home.css";

ReactDOM.render(
	// <React.StrictMode>
	<Dapp />,
	// </React.StrictMode>,
	document.getElementById("root")
);

declare global {
	interface Window {
		ethereum: Web3Provider;
	}
}
