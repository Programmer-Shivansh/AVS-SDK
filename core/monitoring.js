const EventEmitter = require('events');

class AVSMonitor extends EventEmitter {
    constructor() {
        super();
        this.metrics = {
            nodeUptime: {},
            requestCount: {},
            latency: {},
            errorRate: {}
        };
    }

    startMonitoring(nodeId) {
        this.metrics.nodeUptime[nodeId] = process.hrtime()[0];
        this.metrics.requestCount[nodeId] = 0;
        this.metrics.errorRate[nodeId] = 0;
        
        setInterval(() => {
            this.emit('metrics', {
                nodeId,
                uptime: process.hrtime()[0] - this.metrics.nodeUptime[nodeId],
                requests: this.metrics.requestCount[nodeId],
                errorRate: this.metrics.errorRate[nodeId]
            });
        }, 5000);
    }

    recordRequest(nodeId, latency, isError = false) {
        this.metrics.requestCount[nodeId]++;
        this.metrics.latency[nodeId] = latency;
        if (isError) {
            this.metrics.errorRate[nodeId]++;
        }
    }

    getNodeMetrics(nodeId) {
        return {
            uptime: process.hrtime()[0] - this.metrics.nodeUptime[nodeId],
            requests: this.metrics.requestCount[nodeId],
            avgLatency: this.metrics.latency[nodeId],
            errorRate: this.metrics.errorRate[nodeId]
        };
    }
}

module.exports = AVSMonitor ;