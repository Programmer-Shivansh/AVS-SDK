const { AVSNode, AVSMonitor, AVSSecurity, AVSLoadBalancer } = require('../core');

async function runAdvancedNode() {
    // Initialize components
    const security = new AVSSecurity('your-secret-key');
    const monitor = new AVSMonitor();
    const loadBalancer = new AVSLoadBalancer();

    // Node configuration
    const nodeConfig = {
        port: 3000,
        protocol: 'http',
        security: {
            enableEncryption: true,
            rateLimit: 100
        },
        monitoring: {
            enabled: true,
            interval: 5000
        }
    };

    // Create and initialize node
    const credentials = security.generateNodeCredentials();
    const node = new AVSNode(credentials.nodeId, nodeConfig);

    // Setup monitoring
    monitor.startMonitoring(credentials.nodeId);
    monitor.on('metrics', (metrics) => {
        console.log('Node Metrics:', metrics);
    });

    // Register with load balancer
    loadBalancer.registerNode(credentials.nodeId, `${nodeConfig.protocol}://localhost:${nodeConfig.port}`);

    // Start node
    await node.start();

    // Example operation handlers
    node.handleOperation('validate', async (data) => {
        const startTime = Date.now();
        try {
            // Perform validation logic
            const result = await someValidationLogic(data);
            
            // Record metrics
            monitor.recordRequest(credentials.nodeId, Date.now() - startTime);
            
            return result;
        } catch (error) {
            monitor.recordRequest(credentials.nodeId, Date.now() - startTime, true);
            throw error;
        }
    });

    return {
        node,
        monitor,
        loadBalancer,
        security,
        credentials
    };
}

// Example validation logic
async function someValidationLogic(data) {
    // Implement your validation logic here
    return { isValid: true, timestamp: Date.now() };
}
