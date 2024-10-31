const { AVSCache } = require('../core'); // This is correct
const cache = new AVSCache(500); // Create a cache instance with a maximum size of 500

// Set cache items
cache.set('user:123', { name: 'John Doe' }, 600); // User data with 10 minutes TTL
cache.set('session:456', { token: 'abc123' }); // Session data with default TTL

// Get a cached item
const user = cache.get('user:123');
if (user) {
    console.log('User data:', user); // Outputs: User data: { name: 'John Doe' }
} else {
    console.log('User not found or expired.');
}

// Clear the cache
cache.clear(); 