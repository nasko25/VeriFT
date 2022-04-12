# Eth dev template

## Backend

Backend may not be necessary.

## Contracts

Contracts = solidity + hardhat + typescript.

Remember to `npm install`.

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.ts
TS_NODE_FILES=true npx ts-node scripts/deploy.ts
npx eslint '**/*.{js,ts}'
npx eslint '**/*.{js,ts}' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```

```shell
npx hardhat run --network ropsten scripts/deploy.ts
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Hello, Hardhat!"
```

## Frontend

Frontend = next + tailwind + ethers (+vercel).

Remember to `npm install`.

```shell
npm run dev
```

All files named with `.page.js` under `frontend/pages` will be treated as pages.
All files named with `.api.js` under `frontend/pages/api` will be treated as stateless api endpoints (like aws lambda).
