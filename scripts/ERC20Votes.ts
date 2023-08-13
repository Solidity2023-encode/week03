import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";

const MINT_VALUE = ethers.parseUnits("1");
async function main() {
    const [deployer, acc1, acc2] = await ethers.getSigners();
    const contractFactory = new MyToken__factory(deployer);
    const contract = await contractFactory.deploy();
    await contract.waitForDeployment(); 
    const contractAddress = await contract.getAddress();
    console.log(`Token contract deployed at ${contractAddress}\n`);

    // Mint some tokens
  const mintTx = await contract.mint(deployer.address, MINT_VALUE);
  await mintTx.wait();
  console.log(
    `Minted ${MINT_VALUE.toString()} decimal units to account ${
      deployer.address
    }\n`
  );
  const balanceBN = await contract.balanceOf(deployer.address);
  console.log(
    `Account ${
      deployer.address
    } has ${balanceBN.toString()} decimal units of MyToken\n`
  );

  const votes = await contract.getVotes(deployer.address);
  console.log(
    `Account ${
      deployer.address
    } has ${votes.toString()} units of voting power before self delegating\n`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});