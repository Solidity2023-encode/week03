import { Wallet, ethers } from "ethers";
import { Ballot__factory } from "../typechain-types";

import * as dotenv from "dotenv";

dotenv.config();
const setupProvider = () => {
    return new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL?? "")
}
const getDeployedContract = (wallet: Wallet) => {
    const address = '0xD6DdDC255D745Da6d524b61971cF7295bad9aac1';
    const ballotContract = new ethers.Contract(address, Ballot__factory.abi, wallet);
    return ballotContract;
}
const delegate = async (targetAddress: string) => {
    const provider = setupProvider();
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
    const contract = getDeployedContract(wallet);
    const txn = await contract.delegate(targetAddress)
    await txn.wait();
}

delegate("0x67f1452b3099CfB27E708130421c98aD2319C0b7").then((data) => console.log("done")).catch((err)=> console.error(err))