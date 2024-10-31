const { AVSSmartContract, AVSMonitor } = require('../core');
const { TestingTool, DebuggingTool } = require('../tools');

async function deployComplexContract() {
    const providerUrl = 'http://localhost:8545';
    const contractPath = '../templates/consensusMechanism.sol';
    
    // Initialize components
    const contract = new AVSSmartContract('ConsensusEngine', providerUrl);
    const monitor = new AVSMonitor();
    const debuggeri = new DebuggingTool({ logLevel: 'debug' });
    const tester = new TestingTool({ providerUrl });

    try {
        // Deploy contract
        const deployedContract = await contract.deploy(contractPath, [3]); // 3 required validations
        debuggeri.logDeploymentDetails(deployedContract);

        // Test contract
        const testCases = [
            {
                name: 'Validator Registration',
                functionName: 'registerValidator',
                args: [],
                expected: true
            },
            {
                name: 'Submit Validation',
                functionName: 'submitValidation',
                args: ['0x123...'],
                expected: true
            }
        ];

        const testResults = await tester.testSmartContract(contract, testCases);
        console.log('Test Results:', testResults);

        return {
            contract: deployedContract,
            monitor,
            debuggeri,
            testResults
        };
    } catch (error) {
        debuggeri.log('error', error);
        throw error;
    }
}

module.exports = {
    runAdvancedNode,
    deployComplexContract
};