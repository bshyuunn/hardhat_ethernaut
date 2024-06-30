const { loadFixture, } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");
const { expect } = require("chai");
  
describe("Level04 - Telephone", function () {
    async function setUp() {
        const [owner, hacker] = await ethers.getSigners();

        const TelephoneContract = await ethers.deployContract("Telephone");
        const TelephoneAddress = await TelephoneContract.getAddress();

        const ExploitContract = await ethers.deployContract("Level04TelephoneExploit", [hacker, TelephoneAddress]);
        const ExploitAddress = await ExploitContract.getAddress();

        return {owner, hacker, TelephoneContract, ExploitContract, TelephoneAddress, ExploitAddress};
    };

    describe("Level04 hacking", () => {
        it("should allow the hacker to become the owner of the Telephone contract", async() => {
            const {owner, hacker, TelephoneContract, ExploitContract, TelephoneAddress, ExploitAddress} = await loadFixture(setUp);
            
            await ExploitContract.connect(hacker).attack();
            expect(await TelephoneContract.owner()).to.equal(hacker.address);
        }); 
    })

});