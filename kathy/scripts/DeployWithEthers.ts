import { ethers } from "ethers";
import { TokenizedBallot__factory } from "../typechain-types"; // Update the import
import * as dotenv from "dotenv";
dotenv.config();

function setupProvider() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_END_POINT ?? "");
  return provider;
}

async function main() {
  const proposals = process.argv.slice(2);
  console.log("Deploying TokenizedBallot contract");
  console.log("Proposals: ");
  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });
  const provider = setupProvider();
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);

  const balanceBN = await provider.getBalance(wallet.address);
  const balance = Number(ethers.formatEther(balanceBN));
  // console.log(`Wallet Balance ${balance}`);

  console.log(provider);
  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }

  const ballotFactory = new TokenizedBallot__factory(wallet); // Update the contract factory
  const blockNumber = await provider.getBlockNumber();
  const targetBlockNumber = blockNumber + 100; // Update the target block number
  const ballotContract = await ballotFactory.deploy(
    proposals.map(ethers.utils.c),
    process.env.TOKEN_ADDRESS, // Set the token contract address here
    targetBlockNumber
  );
  await ballotContract.deployed();
  const address = ballotContract.address;
  console.log(`Contract deployed to the address ${address}`);
  for (let index = 0; index < proposals.length; index++) {
    const proposal = await ballotContract.proposals(index);

    const name = ethers.utils.parseBytes32String(proposal.name);
    console.log({ index, name, proposal });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// import { ethers } from "ethers";
// import { Ballot__factory } from "../typechain-types";
// import * as dotenv from "dotenv";
// dotenv.config();

// function setupProvider() {
//   const provider = new ethers.JsonRpcProvider(process.env.RPC_END_POINT ?? "");
//   //const provider = ethers.getDefaultProvider("sepolia");
//   return provider;
// }

// async function main() {
//   const proposals = process.argv.slice(2);
//   console.log("Deploying Ballot contract");
//   console.log("Proposals: ");
//   proposals.forEach((element, index) => {
//     console.log(`Proposal N. ${index + 1}: ${element}`);
//   });
//   const provider = setupProvider();
//   const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
//   //const wallet = ethers.Wallet.fromPhrase(process.env.MNEMONIC ?? "", provider);

//   const balanceBN = await provider.getBalance(wallet.address);
//   const balance = Number(ethers.formatUnits(balanceBN));
//   // console.log(`Wallet Balance ${balance}`);

//   console.log(provider);
//   if (balance < 0.01) {
//     throw new Error("Not enough ether");
//   }

//   const ballotFactory = new Ballot__factory(wallet);
//   const ballotContract = await ballotFactory.deploy(
//     proposals.map(ethers.encodeBytes32String)
//   );
//   await ballotContract.waitForDeployment();
//   const address = await ballotContract.getAddress();
//   console.log(`Contract deployed to the address ${address}`);
//   for (let index = 0; index < proposals.length; index++) {
//     const proposal = await ballotContract.proposals(index);

//     const name = ethers.decodeBytes32String(proposal.name);
//     console.log({ index, name, proposal });
//   }
// }

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
