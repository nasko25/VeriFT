import { ethers } from "hardhat";

async function main() {
  const NewsDAO = await ethers.getContractFactory("NewsDAO");
  const newsDAO = await NewsDAO.deploy();
  await newsDAO.deployed();

  const VotingModule = await ethers.getContractFactory("VotingModule");
  const votingModule = await VotingModule.deploy(
    newsDAO.address,
    newsDAO.address
  );
  await votingModule.deployed();

  console.log({
    daoAddress: newsDAO.address,
    modAddress: votingModule.address,
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
