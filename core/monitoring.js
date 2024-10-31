const EventEmitter = require('events');

class AVSMonitor extends EventEmitter {
    constructor() {
        super();
        this.metrics = {
            nodeUptime: {},
            requestCount: {},
            latency: {},
            errorRate: {},
            startTime: {}
        };
        this.intervals = {}; // Store interval references for cleanup
    }

    startMonitoring(nodeId) {
        // Initialize or reset metrics for the node
        this.metrics.startTime[nodeId] = Date.now();
        this.metrics.nodeUptime[nodeId] = 0;
        this.metrics.requestCount[nodeId] = 0;
        this.metrics.errorRate[nodeId] = 0;
        this.metrics.latency[nodeId] = [];  // Store array of latencies for average calculation

        // Clear existing interval if any
        if (this.intervals[nodeId]) {
            clearInterval(this.intervals[nodeId]);
        }

        // Set new interval
        this.intervals[nodeId] = setInterval(() => {
            const currentMetrics = this.getNodeMetrics(nodeId);
            this.emit('metrics', {
                nodeId,
                ...currentMetrics
            });
        }, 5000);

        // Return the nodeId for chaining
        return nodeId;
    }

    stopMonitoring(nodeId) {
        if (this.intervals[nodeId]) {
            clearInterval(this.intervals[nodeId]);
            delete this.intervals[nodeId];
        }
        // Clean up metrics
        delete this.metrics.startTime[nodeId];
        delete this.metrics.nodeUptime[nodeId];
        delete this.metrics.requestCount[nodeId];
        delete this.metrics.errorRate[nodeId];
        delete this.metrics.latency[nodeId];
    }

    recordRequest(nodeId, latency, isError = false) {
        if (!this.metrics.requestCount[nodeId]) {
            this.startMonitoring(nodeId);
        }

        this.metrics.requestCount[nodeId]++;
        this.metrics.latency[nodeId].push(latency);
        
        if (isError) {
            this.metrics.errorRate[nodeId]++;
        }
    }

    getNodeMetrics(nodeId) {
        if (!this.metrics.startTime[nodeId]) {
            return null;
        }

        // Calculate uptime in seconds
        const uptime = Math.floor((Date.now() - this.metrics.startTime[nodeId]) / 1000);

        // Calculate average latency
        const avgLatency = this.metrics.latency[nodeId].length > 0
            ? Math.round(this.metrics.latency[nodeId].reduce((a, b) => a + b, 0) / this.metrics.latency[nodeId].length)
            : 0;

        // Calculate error rate as percentage
        const errorRate = this.metrics.requestCount[nodeId] > 0
            ? (this.metrics.errorRate[nodeId] / this.metrics.requestCount[nodeId] * 100).toFixed(2)
            : 0;

        return {
            uptime,
            requests: this.metrics.requestCount[nodeId],
            avgLatency,
            errorRate: parseFloat(errorRate),
            lastLatency: this.metrics.latency[nodeId][this.metrics.latency[nodeId].length - 1] || 0
        };
    }

    // Cleanup method to prevent memory leaks
    cleanup() {
        Object.keys(this.intervals).forEach(nodeId => {
            this.stopMonitoring(nodeId);
        });
        this.removeAllListeners();
    }
}

module.exports = AVSMonitor;