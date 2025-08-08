const cron = require('node-cron');
const { updateCacheInBackground } = require('../controllers/newsController');

class CacheUpdateService {
    static start() {
        console.log('Starting periodic cache update service...');
        
        // Update cache every 15 minutes
        cron.schedule('*/15 * * * *', async () => {
            console.log('Running scheduled cache update...');
            await updateCacheInBackground();
        });
        
        // Also run immediately on startup
        setTimeout(async () => {
            console.log('Running initial cache update...');
            await updateCacheInBackground();
        }, 5000); // Wait 5 seconds after startup
    }
    
    static stop() {
        cron.destroy();
        console.log('Periodic cache update service stopped');
    }
}

module.exports = CacheUpdateService;