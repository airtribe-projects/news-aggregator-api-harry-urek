const NodeCache = require('node-cache');

// Cache with TTL of 1 hour (3600 seconds) for news articles
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

class CacheService {
    static async get(key) {
        try {
            return cache.get(key);
        } catch (error) {
            console.error('Cache get error:', error);
            return null;
        }
    }

    static async set(key, value, ttl = 3600) {
        try {
            return cache.set(key, value, ttl);
        } catch (error) {
            console.error('Cache set error:', error);
            return false;
        }
    }

    static async del(key) {
        try {
            return cache.del(key);
        } catch (error) {
            console.error('Cache delete error:', error);
            return false;
        }
    }

    static async flush() {
        try {
            cache.flushAll();
            return true;
        } catch (error) {
            console.error('Cache flush error:', error);
            return false;
        }
    }

    static getStats() {
        return cache.getStats();
    }

    static getKeys() {
        return cache.keys();
    }
}

module.exports = CacheService;