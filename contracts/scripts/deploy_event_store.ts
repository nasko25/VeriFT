import { ethers } from "hardhat";

async function main() {
    const EventToAddressStore = await ethers.getContractFactory("EventToAddressStore");
    const eventToAddressStore = await EventToAddressStore.deploy();
    await eventToAddressStore.deployed();

    console.log("EventToAddressStore address: ", eventToAddressStore.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
  