import { ethers } from "ethers";
import React from "react";
// import ethers from "ethers";
import {
	convertWeiToEth,
	convertEthToWei,
	robotizeBigInts,
} from "./WriteContract/genericTransactionHandler";

// import {convertWeiToEth, convertEthToWei}

export function Helper({ id }) {
	const [val, setVal] = React.useState("");
	return (
		<div id={id}>
			<aside>Dev Tools</aside>
			<div>
				<input
					type="text"
					value={val}
					onPaste={handlePaste}
					onChange={(e) => handleChange(e)}
					placeholder="to eth"
				/>
			</div>
		</div>
	);
}

export function oldHelper({ id }) {
	// const classes = useStyles();
	// const [val, setVal] = React.useState("");
	// const [pasted, setPasted] = React.useState(false);
	// return (
	// 	<div id={id}>
	// 		<aside>Dev Tools</aside>
	// 		<div>
	// 			<input
	// 				type="text"
	// 				value={val}
	// 				onPaste={handlePaste}
	// 				onChange={(e) => handleChange(e)}
	// 				placeholder="to wei"
	// 			/>
	// 			<input
	// 				type="text"
	// 				value={val}
	// 				onPaste={handlePaste}
	// 				onChange={(e) => handleChange(e)}
	// 				placeholder="to eth"
	// 			/>
	// 		</div>
	// 	</div>
	// );
}

function handlePaste(event) {
	// Get pasted data via clipboard API
	const clipboardData = event.clipboardData; // || window.clipboardData;
	let pastedData = clipboardData?.getData("Text");

	if (!pastedData) {
		pastedData = event.target.value;
	}
	console.log({ pastedData });
	const robotized = robotizeBigInts(pastedData);
	console.log({ robotized });
	// console.log({ pastedData });
	// let value;
	// try {
	// 	try {
	// 		// value = convertEthToWei(pastedData);
	// 		// value = ethers.utils.formatUnits(pastedData, "eth");
	// 		// value = ethers.utils.parseUnits(pastedData, "wei");
	// 		value = ethers.utils.formatUnits(value, "eth");
	// 		// console.log("convertEthToWei");
	// 	} catch (e) {}
	// 	// try {
	// 	// 	value = convertWeiToEth(pastedData);
	// 	// 	console.log("convertWeiToEth");
	// 	// } catch (e) {}
	// } catch (e) {
	// 	console.error(e?.message);
	// }
	// console.log({ value: value?.toString() });
	// setPasted(true);
	// event.target.value = value;
	// return value;

}

function handleChange(e) {
	// if (e.key === "Enter") {
	// 	console.log("do validate");
	// }
	// if (!pasted) {
	// 	setVal(e.target.value);
	// }
	// setPasted(false);
	// return handlePaste(e);
}
