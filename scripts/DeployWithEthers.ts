import { ethers } from "ethers";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";

dotenv.config();
const setupProvider = () => {
    return new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL?? "")
}

async function main() {

  const proposals = process.argv.slice(2);
  console.log("Deploying Ballot contract");
  console.log("Proposals: ");
  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });

  const provider = setupProvider();
  const lastBlock = await provider.getBlock('latest');
  console.log({lastBlock});
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
  const ballotFactory = new Ballot__factory(wallet);//await ethers.getContractFactory("Ballot");
  const balanceBN = await provider.getBalance(wallet.address);
  const balance = Number(ethers.formatUnits(balanceBN));
  const ballotContract = await ballotFactory.deploy(proposals.map(ethers.encodeBytes32String))
  await ballotContract.waitForDeployment();

  const address = await ballotContract.getAddress()
  console.log(`Contract deployed to address ${address}`)
  for (let index= 0; index < proposals.length; index++) {
    const proposal = await ballotContract.proposals(index);
    const name = ethers.decodeBytes32String(proposal.name)
    console.log({index, name, proposal})
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
