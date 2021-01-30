import { ethers } from "ethers";
import Artifact from "../../contracts/SBToken.json";
import { Dapp, InitialState } from "../Dapp";

interface Core {
	contract: ethers.Contract;
	state: InitialState;
	genericTransactionHandler: Function;
}

export interface AbiMethod {
	type: string;
	inputs: typeof Artifact.abi[0]["inputs"];
	name: string;
}

export interface WriteContractParams extends Core {
	abi: typeof Artifact.abi;
}

export interface SubmitParams extends Core {
	method: AbiMethod;
}

export interface RenderParams extends SubmitParams {
	buffer: JSX.Element[];
}
