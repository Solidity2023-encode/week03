import { Wallet, ethers } from "ethers";
import { TokenizedBallot__factory } from "../typechain-types"; // Update the import

import * as dotenv from "dotenv";

dotenv.config();
const setupProvider = () => {
    return new ethers.JsonRpcProvider(process.env.RPC_END_POINT ?? "");
}
const getDeployedContract = (wallet: Wallet) => {
    const address = '0xD6DdDC255D745Da6d524b61971cF7295bad9aac1'; // Update with the TokenizedBallot contract address
    const ballotContract = new ethers.Contract(address, TokenizedBallot__factory.abi, wallet);
    return ballotContract;
}
const query = async () => {
    const provider = setupProvider();
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
    const contract = getDeployedContract(wallet);
    for (let index = 0; index < 3; index++) {
        const proposal = await contract.proposals(index);
        const name = ethers.utils.parseBytes32String(proposal.name); // Update the decoding method
        const count = proposal.voteCount;
        console.log({ index, name, count })
    }
}

query().then((data) => console.log("done")).catch((err) => console.error(err))