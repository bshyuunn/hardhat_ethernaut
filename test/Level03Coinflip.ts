const { loadFixture, } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");
const { expect } = require("chai");
  
describe("Level03 - Coinflip", function () {
    async function setUp() {
        const [owner, hacker] = await ethers.getSigners();

        const CoinFlipContract = await ethers.deployContract("CoinFlip");
        const CoinFlipAddress = await CoinFlipContract.getAddress();

        const ExploitContract = await ethers.deployContract("Level03CoinflipExploit", [hacker, CoinFlipAddress]);
        const ExploitAddress = await ExploitContract.getAddress();

        return {owner, hacker, CoinFlipContract, ExploitContract, CoinFlipAddress, ExploitAddress};
    };

    describe("Level03 hacking", () => {
        it("should allow the hacker to achieve 10 consecutive wins using the exploit", async() => {
            const {owner, hacker, CoinFlipContract, ExploitContract, CoinFlipAddress, ExploitAddress} = await loadFixture(setUp);
        
            expect(await CoinFlipContract.consecutiveWins()).to.equal(0);
            for (let i = 0; i < 10; i++) {
                let tx = await ExploitContract.connect(hacker).attack();
                await tx.wait();
                // 트랜잭션이 블록체인에서 확인될 때까지 대기
            }

            expect(await CoinFlipContract.consecutiveWins()).to.equal(10);

        }); 
    })

});