const { AVSMonitor } = require('../core');

const monitor = new AVSMonitor();

// Start monitoring and add event listener
monitor.on('metrics', (metrics) => {
    console.log('Metrics Update:', metrics);
});

async function monitorNode() {
    console.log('Starting monitoring...');
    
    monitor.startMonitoring('Node1');
    
    // Record some requests
    monitor.recordRequest('Node1', 120, false);
    monitor.recordRequest('Node1', 200, true);
    
    // Get immediate metrics
    const metrics = monitor.getNodeMetrics('Node1');
    console.log('Immediate Node Metrics:', metrics);
    
    // Wait for 6 seconds to see one metrics emission
    await new Promise(resolve => setTimeout(resolve, 6000));
    
    // Stop monitoring and cleanup
    monitor.cleanup();
    console.log('Monitoring stopped');
}

monitorNode();