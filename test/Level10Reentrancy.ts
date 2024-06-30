const { loadFixture, } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");
const { expect } = require("chai");
  
describe("Level10 - Reentrancy", function () {
    async function setUp() {
        const [owner, hacker] = await ethers.getSigners();

        const ReentrancyContract = await ethers.deployContract("Reentrancy");
        const ReentrancyAddress = await ReentrancyContract.getAddress();

        await hacker.sendTransaction({to: ReentrancyAddress, value: ethers.parseEther("0.0005")});
        
        const ExploitContract = await ethers.deployContract("Level10ReentrancyExploit", [ReentrancyAddress], {value: ethers.parseEther("0.0001")});
        const ExploitAddress = await ExploitContract.getAddress();

        return {owner, hacker, ReentrancyContract, ExploitContract, ReentrancyAddress, ExploitAddress};
    };

    describe("Level10 hacking", () => {
        it("should perform a reentrancy attack and drain all funds from the Reentrancy contract", async() => {
            const {owner, hacker, ReentrancyContract, ExploitContract, ReentrancyAddress, ExploitAddress} = await loadFixture(setUp);
            
            await ExploitContract.donate();

            expect(await ReentrancyContract.connect(hacker).balanceOf(ExploitAddress)).to.equal(ethers.parseEther("0.0001"));

            await ExploitContract.attack();
            expect(await ethers.provider.getBalance(ReentrancyAddress)).to.equal("0");
        }); 

    })

});