import { ethers } from "ethers";
import { TokenizedBallot__factory } from "../typechain-types"; // Update this import
import * as dotenv from "dotenv";

dotenv.config();

function setupProvider() {
  console.log("URL env: " + process.env.RPC_END_POINT);
  const provider = new ethers.JsonRpcProvider(process.env.RPC_END_POINT ?? "");
  return provider;
}

const deployedContract = "0xD6DdDC255D745Da6d524b61971cF7295bad9aac1"; // Update this address

async function castVote() {
  const proposalId = parseInt(process.argv.slice(2)[0]);
  console.log(`proposalId is ${proposalId}`);

  const provider = setupProvider();
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);

  const contract = new ethers.Contract(
    deployedContract,
    TokenizedBallot__factory.abi, // Update the contract factory
    wallet
  );

  // Adjust this part to vote with the required amount of tokens
  const amountToVote = 100; // Adjust the amount of tokens you want to vote with

  await contract.vote(proposalId, amountToVote); // Update this line
}

castVote().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});