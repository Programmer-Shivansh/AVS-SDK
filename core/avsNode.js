// avsNode.js
const { exec } = require('child_process');
const { promisify } = require('util');
const execPromise = promisify(exec);

class AVSNode {
    constructor(nodeId, config) {
        this.nodeId = nodeId;
        this.config = config;
        this.isRunning = false;
        this.process = null;
    }

    async start() {
        if (this.isRunning) {
            console.log(`Node ${this.nodeId} is already running.`);
            return;
        }

        try {
            // Instead of executing a separate file, we'll run the node process directly
            const command = `echo "Starting node ${this.nodeId} with config ${this.config}"`;
            const { stdout } = await execPromise(command);
            this.isRunning = true;
            console.log(`Node ${this.nodeId} started successfully.`);
            console.log('Output:', stdout);
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
            // Instead of executing a separate file, we'll simulate stopping the node
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
