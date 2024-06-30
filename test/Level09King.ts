const { loadFixture, } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");
const { expect } = require("chai");
  
describe("Level09 - KING", function () {
    async function setUp() {
        const [owner, hacker] = await ethers.getSigners();

        const KingContract = await ethers.deployContract("King", [], {value: ethers.parseEther("0.0001")});
        const KingAddress = await KingContract.getAddress();
        
        const ExploitContract = await ethers.deployContract("Level09KingExploit", [KingAddress], {value: ethers.parseEther("0.0001")});
        const ExploitAddress = await ExploitContract.getAddress();

        return {owner, hacker, KingContract, ExploitContract, KingAddress, ExploitAddress};
    };

    describe("Level09 hacking", () => {
        it("should take over the king position and prevent others from claiming the throne", async() => {
            const {owner, hacker, KingContract, ExploitContract, KingAddress, ExploitAddress} = await loadFixture(setUp);
            
            await ExploitContract.attack();
            expect(await KingContract.connect(hacker)._king()).to.equal(ExploitAddress);

            expect(hacker.sendTransaction({to: KingAddress, value: ethers.parseEther("0.00002")})).to.be.reverted;
        }); 

    })

});