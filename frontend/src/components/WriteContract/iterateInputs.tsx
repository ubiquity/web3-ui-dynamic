import { ethers } from "ethers";

export function iterateInputs({ input, params }: { input: any; params: any[] }) {
	if (input.tagName === "INPUT") {
		const dataType = input.getAttribute(`data-type`);

		const param =
			{
				address: (value) => value,
				uint256: (value) => ethers.BigNumber.from(value),
			}[input.getAttribute(`data-type`)](input.value) || console.error(dataType);

		// console.log({ param, dataType });

		params.push(param);
	}
}
