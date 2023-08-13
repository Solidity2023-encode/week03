import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types"

const MINT_VALUE = 1n;

async function main() {
    const [deployer, acc1, acc2] = await ethers.getSigners();
    const contractFactory = new MyToken__factory(deployer);
    const contract = await contractFactory.deploy();
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();
    console.log(`Token contract deployed at ${contractAddress}\n`);

    // Mint some tokens
    const mintTx = await contract.mint(acc1.address, MINT_VALUE);
    await mintTx.wait();
    console.log(
        `Minted ${MINT_VALUE.toString()} decimal units to account ${acc1.address
        }\n`
    );
    const balanceBN = await contract.balanceOf(acc1.address);
    console.log(
        `Account ${acc1.address
        } has ${balanceBN.toString()} decimal units of MyToken\n`
    );

    // Check the voting power
    const votes = await contract.getVotes(acc1.address);
    console.log(
        `Account ${acc1.address
        } has ${votes.toString()} units of voting power before self delegating\n`
    );

    // Self delegate
    const delegateTx = await contract.connect(acc1).delegate(acc1.address);
    await delegateTx.wait();

    // Check the voting power
    const votesAfter = await contract.getVotes(acc1.address);
    console.log(
        `Account ${acc1.address
        } has ${votesAfter.toString()} units of voting power after self delegating\n`
    );

    // Transfer tokens
    const transferTx = await contract
        .connect(acc1)
        .transfer(acc2.address, MINT_VALUE / 2n);
    await transferTx.wait();

    // Check the voting power
    const votes1AfterTransfer = await contract.getVotes(acc1.address);
    console.log(
        `Account ${acc1.address
        } has ${votes1AfterTransfer.toString()} units of voting power after transfering\n`
    );
    const votes2AfterTransfer = await contract.getVotes(acc2.address);
    console.log(
        `Account ${acc2.address
        } has ${votes2AfterTransfer.toString()} units of voting power after receiving a transfer\n`
    );

    // check past voting power
    const lastBlock = await ethers.provider.getBlock("latest");
    const number = lastBlock?.number ?? 0;
    console.log(`Current block number is ${lastBlock?.number}\n`);
    const pastVotes = await contract.getPastVotes(
        acc1.address, lastBlock?.number ? lastBlock?.number - 1 : 0
    );
    console.log(
        `Account ${acc1.address
        } has ${pastVotes.toString()} units of voting power at previous block\n`

    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});