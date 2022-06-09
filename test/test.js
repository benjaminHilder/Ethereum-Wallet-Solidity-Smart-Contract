const { expect } = require("chai");
const { ethers } = require("hardhat");
const { expectRevert} = require("@openzeppelin/test-helpers");
describe("Ethereum Wallet", async () => {
    let owner;
    let addr1;
    let addr2;
    let ethereumWallet;

    beforeEach(async() => {
        [owner, addr1, addr2] = await ethers.getSigners();

        let EthereumWallet = await ethers.getContractFactory("EthereumWallet");
        ethereumWallet = await EthereumWallet.deploy(owner.address);
        await ethereumWallet.deployed();
    })

    it("should let owner able to deposit ether into the wallet", async() => {
        await ethereumWallet.connect(owner).deposit({value: 10});
        let balance = await ethereumWallet.balance();

        expect(balance).to.equal(10)
    })

    it('should let anyone deposit', async() => {
        await ethereumWallet.connect(addr1).deposit({value: 10});
        let balance = await ethereumWallet.balance();

        expect(balance).to.equal(10)
    })

    it("should let owner able to deposit ether into the wallet", async() => {
        await ethereumWallet.connect(owner).deposit({value: 10});
        let balance = await ethereumWallet.balance();

        expect(balance).to.equal(10)

        await ethereumWallet.connect(owner).send(addr1.address, {value: 10});
        let balanceAddr1 = await ethereumWallet.connect(addr1).balance();

        expect(balanceAddr1).to.equal(10)
    })

    it("SHOULDNT allow not the owner to send ether", async() => {
        await ethereumWallet.connect(owner).deposit({value: 10});
        let balance = await ethereumWallet.balance();

        expect(balance).to.equal(10)

        await expectRevert(
        ethereumWallet.connect(addr1).send(addr2.address, {value: 10}),
        "VM Exception while processing transaction"
        )
    })

})