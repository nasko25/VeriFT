import { expect } from "chai";
import { ethers } from "hardhat";

describe("Tickets", function () {
    it("Should revert when the NFT does not exist", async function () {
        const [owner] = await ethers.getSigners();  //get signer

        //deploy the required NFT
        const ExampleNFT = await ethers.getContractFactory("ExampleNFT");
        const exampleNFT = await ExampleNFT.deploy("example", "EXM");

        await exampleNFT.deployed();

        //deploy the event contract
        const Event = await ethers.getContractFactory("Event");
        const event = await Event.deploy(exampleNFT.address, 2, 0, "Cool Event", "CENT", "ASD");

        await event.deployed();

        await expect(
            event.mintTicket(0, 'abd')
        ).to.be.revertedWith("ERC721: owner query for nonexistent token");
    });

    it("Should revert when user does not hold the NFT", async function () {
        const [owner, addr1, addr2] = await ethers.getSigners();  //get signer

        //deploy the required NFT
        const ExampleNFT = await ethers.getContractFactory("ExampleNFT");
        const exampleNFT = await ExampleNFT.deploy("example", "EXM");

        await exampleNFT.deployed();

        //deploy the event contract
        const Event = await ethers.getContractFactory("Event");
        const event = await Event.deploy(exampleNFT.address, 2, 0, "Cool Event", "CENT", "ASD");

        await event.deployed();

        await exampleNFT.mint("ABC");

        await expect(
            event.connect(addr1).mintTicket(0, 'abd')
        ).to.be.revertedWith("You do not own this NFT");
    });

    it("Should revert when mintin too many tickets", async function () {
        const [owner] = await ethers.getSigners();  //get signer

        //deploy the required NFT
        const ExampleNFT = await ethers.getContractFactory("ExampleNFT");
        const exampleNFT = await ExampleNFT.deploy("example", "EXM");

        await exampleNFT.deployed();

        //deploy the event contract
        const Event = await ethers.getContractFactory("Event");
        const event = await Event.deploy(exampleNFT.address, 2, 0, "Cool Event", "CENT", "ASD");

        await event.deployed();

        await exampleNFT.mint("ABC");
        event.mintTicket(0, 'abd')
        event.mintTicket(0, 'abd')

        await expect(
            event.mintTicket(0, 'abd')
        ).to.be.revertedWith("All possible tickets have been minted from this NFT");
    });
});
