const AVSNode = require('./avsNode');
const AVSSmartContract = require('./avsSmartContract');
const AVSMonitor = require('./monitoring');
const AVSSecurity = require('./security');
const AVSLoadBalancer = require('./loadBalancer');
const AVSCache = require('./cache');

module.exports = {
    AVSNode,
    AVSSmartContract,
    AVSMonitor,
    AVSSecurity,
    AVSLoadBalancer,
    AVSCache,
    version: '1.0.0',
    
    // SDK initialization
    init: async (config) => {
        const security = new AVSSecurity(config.secretKey);
        const monitor = new AVSMonitor();
        const loadBalancer = new AVSLoadBalancer();
        const cache = new AVSCache(config.cacheSize);
        
        return {
            security,
            monitor,
            loadBalancer,
            cache
        };
    }
};
