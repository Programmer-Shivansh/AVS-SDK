const assert = require('assert');
const Web3 = require('web3');

class TestingTool {
    constructor(config) {
        this.web3 = new Web3(config.providerUrl);
        this.results = [];
    }

    async testSmartContract(contractInstance, testCases) {
        for (const test of testCases) {
            try {
                const result = await contractInstance.callFunction(
                    test.functionName, 
                    test.args
                );
                
                assert.deepStrictEqual(
                    result, 
                    test.expected, 
                    `Test ${test.name} failed`
                );
                
                this.results.push({
                    name: test.name,
                    status: 'passed',
                    gasUsed: test.receipt?.gasUsed
                });
            } catch (error) {
                this.results.push({
                    name: test.name,
                    status: 'failed',
                    error: error.message
                });
            }
        }
        return this.results;
    }

    async testNodePerformance(node, operations) {
        const results = {
            totalTests: operations.length,
            passed: 0,
            failed: 0,
            metrics: {
                averageResponseTime: 0,
                totalTime: 0,
                peakMemoryUsage: 0
            }
        };

        for (const op of operations) {
            const startTime = process.hrtime();
            try {
                await node[op.function](...op.args);
                const [seconds, nanoseconds] = process.hrtime(startTime);
                const responseTime = seconds * 1000 + nanoseconds / 1e6;
                
                results.metrics.totalTime += responseTime;
                results.passed++;
            } catch (error) {
                results.failed++;
            }
        }

        results.metrics.averageResponseTime = 
            results.metrics.totalTime / operations.length;
        results.metrics.peakMemoryUsage = 
            process.memoryUsage().heapUsed / 1024 / 1024;

        return results;
    }

    generateTestReport() {
        return {
            summary: {
                total: this.results.length,
                passed: this.results.filter(r => r.status === 'passed').length,
                failed: this.results.filter(r => r.status === 'failed').length
            },
            details: this.results
        };
    }
}



module.exports = TestingTool;
