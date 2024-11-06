const Web3 = require('web3');
const { exec } = require('child_process');
const { promisify } = require('util');
const execPromise = promisify(exec);

class AVSNode {
    constructor(nodeId, config, web3ProviderUrl, contractAddress, abi) {
        this.nodeId = nodeId;
        this.config = config;
        this.isRunning = false;
        this.process = null;

        // Initialize Web3
        this.web3 = new Web3(new Web3.providers.HttpProvider(web3ProviderUrl));
        this.contract = new this.web3.eth.Contract(abi, contractAddress);
    }

    async registerNode() {
        // Register node with EigenLayer's AVS smart contract
        try {
            const accounts = await this.web3.eth.getAccounts();
            await this.contract.methods.registerNode(this.nodeId).send({ from: accounts[0] });
            console.log(`Node ${this.nodeId} registered successfully.`);
        } catch (error) {
            console.error(`Error registering node: ${error.message}`);
            throw error;
        }
    }

    async deregisterNode() {
        // Deregister node from EigenLayer's AVS smart contract
        try {
            const accounts = await this.web3.eth.getAccounts();
            await this.contract.methods.deregisterNode(this.nodeId).send({ from: accounts[0] });
            console.log(`Node ${this.nodeId} deregistered successfully.`);
        } catch (error) {
            console.error(`Error deregistering node: ${error.message}`);
            throw error;
        }
    }

    async start() {
        if (this.isRunning) {
            console.log(`Node ${this.nodeId} is already running.`);
            return;
        }

        try {
            await this.registerNode();

            // Simulate starting the node process
            const command = `echo "Starting node ${this.nodeId} with config ${this.config}"`;
            const { stdout } = await execPromise(command);

            this.isRunning = true;
            console.log(`Node ${this.nodeId} started successfully.`);
            console.log('Output:', stdout);

            // Listen for AVS task events (pseudo-code)
            this.contract.events.TaskAssigned({ filter: { nodeId: this.nodeId } }, (error, event) => {
                if (error) console.error(error);
                else console.log(`Task received for node ${this.nodeId}:`, event);
            });
        } catch (error) {
            console.error(`Error starting node: ${error.message}`);
            throw error;
        }
    }

    async stop() {
        if (!this.isRunning) {
            console.log(`Node ${this.nodeId} is not running.`);
            return;
        }

        try {
            await this.deregisterNode();

            // Simulate stopping the node process
            const command = `echo "Stopping node ${this.nodeId}"`;
            const { stdout } = await execPromise(command);

            this.isRunning = false;
            console.log(`Node ${this.nodeId} stopped successfully.`);
            console.log('Output:', stdout);
        } catch (error) {
            console.error(`Error stopping node: ${error.message}`);
            throw error;
        }
    }
}

module.exports = AVSNode;

// // avsNode.js
// const { exec } = require('child_process');
// const { promisify } = require('util');
// const execPromise = promisify(exec);

// class AVSNode {
//     constructor(nodeId, config) {
//         this.nodeId = nodeId;
//         this.config = config;
//         this.isRunning = false;
//         this.process = null;
//     }

//     async start() {
//         if (this.isRunning) {
//             console.log(`Node ${this.nodeId} is already running.`);
//             return;
//         }

//         try {
//             // Instead of executing a separate file, we'll run the node process directly
//             const command = `echo "Starting node ${this.nodeId} with config ${this.config}"`;
//             const { stdout } = await execPromise(command);
//             this.isRunning = true;
//             console.log(`Node ${this.nodeId} started successfully.`);
//             console.log('Output:', stdout);
//         } catch (error) {
//             console.error(`Error starting node: ${error.message}`);
//             throw error;
//         }
//     }

//     async stop() {
//         if (!this.isRunning) {
//             console.log(`Node ${this.nodeId} is not running.`);
//             return;
//         }

//         try {
//             // Instead of executing a separate file, we'll simulate stopping the node
//             const command = `echo "Stopping node ${this.nodeId}"`;
//             const { stdout } = await execPromise(command);
//             this.isRunning = false;
//             console.log(`Node ${this.nodeId} stopped successfully.`);
//             console.log('Output:', stdout);
//         } catch (error) {
//             console.error(`Error stopping node: ${error.message}`);
//             throw error;
//         }
//     }
// }

// module.exports = AVSNode;
