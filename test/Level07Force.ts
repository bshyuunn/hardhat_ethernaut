const { loadFixture, } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");
const { expect } = require("chai");
  
describe("Level07 - Force", function () {
    async function setUp() {
        const [owner, hacker] = await ethers.getSigners();

        const ForceContract = await ethers.deployContract("Force");
        const ForceAddress = await ForceContract.getAddress();

        const ExploitContract = await ethers.deployContract("Level07ForceExploit", [ForceAddress], {value: ethers.parseEther("0.0001")});
        const ExploitAddress = await ExploitContract.getAddress();
        
        return {owner, hacker, ForceContract, ExploitContract, ForceAddress, ExploitAddress};
    };

    describe("Level07 hacking", () => {
        it("should transfer 0.0001 ether to the Force contract using selfdestruct", async() => {
            const {owner, hacker, ForceContract, ExploitContract, ForceAddress, ExploitAddress} = await loadFixture(setUp);
            
            expect(await ethers.provider.getBalance(ForceAddress)).to.equal("0");
            // console.log("ExploitContract balance: ", await ethers.provider.getBalance(ExploitAddress)); 
            await ExploitContract.connect(hacker).attack();
            
            expect(await ethers.provider.getBalance(ForceAddress)).to.equal(ethers.parseEther("0.0001"));
        }); 

    })

});