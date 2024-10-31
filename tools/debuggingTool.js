class DebuggingTool {
    constructor(config = {}) {
        this.logLevel = config.logLevel || 'info';
        this.logs = [];
    }

    logDeploymentDetails(contract) {
        const details = {
            address: contract.options.address,
            abi: contract.options.jsonInterface,
            timestamp: new Date().toISOString(),
            network: contract.options.network
        };
        
        this.log('deployment', details);
        return details;
    }

    logNodeDetails(node) {
        const details = {
            nodeId: node.nodeId,
            config: node.config,
            status: node.isRunning,
            metrics: node.getMetrics(),
            timestamp: new Date().toISOString()
        };
        
        this.log('node', details);
        return details;
    }

    logTransaction(tx) {
        const details = {
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: tx.value,
            gasUsed: tx.gasUsed,
            timestamp: new Date().toISOString()
        };
        
        this.log('transaction', details);
        return details;
    }

    log(type, data) {
        const logEntry = {
            type,
            data,
            timestamp: new Date().toISOString()
        };
        
        this.logs.push(logEntry);
        
        if (this.logLevel === 'debug') {
            console.log(JSON.stringify(logEntry, null, 2));
        }
    }

    getLogs(filter = {}) {
        return this.logs.filter(log => {
            for (const [key, value] of Object.entries(filter)) {
                if (log[key] !== value) return false;
            }
            return true;
        });
    }

    clearLogs() {
        this.logs = [];
    }
}



module.exports = DebuggingTool;
