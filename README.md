A repo to connect the Fund Me contract to a frontend, learned from Patrick Collins.

In this lesson we created everything with pure HTML / Javascript.
Understanding everything with html and js first will make our lifes a lot easier in the future.
Later on, we will use Nextjs / Reactjs.

To use this repo:

-   Git clone / install dependencies / install packages
-   You need either this repo and the hardhat-fund-me-fcc one.
-   We only need the frontend repo open, by opening a 2nd terminal to interact with the hardhat-fund-me-fcc. In the 2nd terminal: cd.. -> cd hardhat-fund-me-fcc -> (commands we want).
-   The commands we want to use in that hardhat-fund-me-fcc terminal is simply yarn hardhat node (automatically deploys the contracts using the deploy folder and creates a localhost node).
-   With this node open and running, from there we want to 1) pick the rpc-url of the localhost and create a new network in metamask with that rpc url, with chain id 31337 to connect to it using metamask.
-   2. pick one of the private keys and import that private key to the metamask so that we can interact with the hardhat localhost chain with one of its keys (with money).
-   3. pick the FundMe contract address that was deployed (not PriceConverter) and input it into the constants.js (I think its always the same and we probably dont need to input it).
-   With the "Live Server" extension installed on vs code, in the frontend repo click "Go Live" in the bottom right corner, and it will open a tab in your browser from where you can interact with the contract.
