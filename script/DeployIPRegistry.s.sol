// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/IPRegistry.sol";

contract DeployIPRegistry is Script {
    function run() external {
        // Set this in your shell: PRIVATE_KEY=<anvil_private_key>
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);
        IPRegistry registry = new IPRegistry();
        vm.stopBroadcast();

        console2.log("IPRegistry deployed at:", address(registry));
    }
}
