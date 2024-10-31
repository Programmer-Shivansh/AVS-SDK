class AVSLoadBalancer {
    constructor() {
        this.nodes = new Map();
        this.healthChecks = new Map();
    }

    registerNode(nodeId, endpoint) {
        this.nodes.set(nodeId, {
            endpoint,
            health: 100,
            lastCheck: Date.now()
        });
        this.startHealthCheck(nodeId);
    }

    async startHealthCheck(nodeId) {
        const check = setInterval(async () => {
            try {
                const response = await fetch(this.nodes.get(nodeId).endpoint + '/health');
                const health = await response.json();
                this.updateNodeHealth(nodeId, health.status === 'ok' ? 100 : 50);
            } catch (error) {
                this.updateNodeHealth(nodeId, 0);
            }
        }, 30000);
        this.healthChecks.set(nodeId, check);
    }

    updateNodeHealth(nodeId, health) {
        const node = this.nodes.get(nodeId);
        if (node) {
            node.health = health;
            node.lastCheck = Date.now();
        }
    }

    getOptimalNode() {
        let bestNode = null;
        let highestHealth = -1;

        for (const [nodeId, node] of this.nodes) {
            if (node.health > highestHealth) {
                highestHealth = node.health;
                bestNode = { nodeId, ...node };
            }
        }

        return bestNode;
    }
}
module.exports = AVSLoadBalancer;