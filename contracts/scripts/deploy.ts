// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {

  const [owner] = await ethers.getSigners();
  const ExampleNFT = await ethers.getContractFactory("ExampleNFT");
  const exampleNFT = await ExampleNFT.deploy("example", "EXM");

  await exampleNFT.deployed();

  const Event = await ethers.getContractFactory("Event");
  const event = await Event.deploy(exampleNFT.address, 2, 0, "Cool Event", "CENT", "ASD");

  await event.deployed();

  await exampleNFT.mint("ABC");
  console.log("Event deployed to:", event.address);

  await event.mintTicket(0, 'abd');
  await event.mintTicket(0, 'abc');
  await event.mintTicket(0, 'abc');


  const ticketAddress = await event.ticketNFTContract();
  const ticketNFTContract = await ethers.getContractAt("TicketNFT", ticketAddress);
  const ticketsHeld = await ticketNFTContract.balanceOf(owner.address);
  console.log("Tickets held:", ticketsHeld);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
