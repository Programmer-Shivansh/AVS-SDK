// passed 
const { AVSNode } = require('../core'); // This is correct

const config = '123';
const nodeInstance = new AVSNode('UniqueNodeID', config);
async function manageNode() {
    await nodeInstance.start(); // Starts the node
    console.log("Passed")
    await nodeInstance.stop(); // Stops the node when done
}

manageNode();