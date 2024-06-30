const { loadFixture, } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");
const { expect } = require("chai");
  
describe("Level00 - HelloEthernaut", function () {
    async function setUp() {
        // ethers.getSigners()는 테스트 환경에서 사용할 수 있는 계정들의 배열을 반환하며, 배열의 첫 번째 요소가 기본적으로 계약을 배포하는 계정이 된다.
        const [owner, hacker] = await ethers.getSigners();

        const HelloEthernautContract = await ethers.deployContract("Instance", ["Fake Password"]);
        const HelloEthernautAddress = await HelloEthernautContract.getAddress();

        return {hacker, HelloEthernautContract, HelloEthernautAddress};
    };

    describe("Level00 hacking", () => {
        it("Hacker should be able to retrieve the password and authenticate successfully", async() => {
            const {hacker, HelloEthernautContract, HelloEthernautAddress} = await loadFixture(setUp);
            
            expect(await HelloEthernautContract.connect(hacker).getCleared()).to.equal(false);
            const password = await HelloEthernautContract.connect(hacker).password();
            // console.log("HelloEthernaut: password is", password);
            await HelloEthernautContract.connect(hacker).authenticate(password);

            expect(await HelloEthernautContract.connect(hacker).getCleared()).to.equal(true);

        });

    })
});
  