const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
    getNews,
    markAsRead,
    markAsFavorite,
    getReadArticles,
    getFavoriteArticles,
    searchNews
} = require('../controllers/newsController');

const router = express.Router();

// Get news articles with caching (backward compatible)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.decodedToken.id;
        const result = await getNews(userId);
        
        // Return in format expected by existing tests
        return res.status(200).json({
            news: result.news,
            message: result.fromCache ? 'Data retrieved from cache' : 'Data fetched from API',
            totalArticles: result.totalArticles,
            fromCache: result.fromCache
        });
    } catch (error) {
        console.error("Error fetching news:", error.message);
        return res.status(500).json({
            error: error.message
        });
    }
});

// Mark article as read
router.post('/:id/read', authenticateToken, async (req, res) => {
    try {
        const userId = req.decodedToken.id;
        const articleId = req.params.id;
        const articleData = req.body; // Optional article data (title, url, etc.)
        
        const result = await markAsRead(userId, articleId, articleData);
        
        return res.status(200).json({
            message: 'Article marked as read successfully',
            ...result
        });
    } catch (error) {
        console.error("Error marking article as read:", error.message);
        return res.status(500).json({
            error: error.message
        });
    }
});

// Mark article as favorite
router.post('/:id/favorite', authenticateToken, async (req, res) => {
    try {
        const userId = req.decodedToken.id;
        const articleId = req.params.id;
        const articleData = req.body; // Optional article data (title, url, description, image)
        
        const result = await markAsFavorite(userId, articleId, articleData);
        
        return res.status(200).json({
            message: 'Article marked as favorite successfully',
            ...result
        });
    } catch (error) {
        console.error("Error marking article as favorite:", error.message);
        return res.status(500).json({
            error: error.message
        });
    }
});

// Get all read articles
router.get('/read', authenticateToken, async (req, res) => {
    try {
        const userId = req.decodedToken.id;
        const result = await getReadArticles(userId);
        
        return res.status(200).json({
            message: 'Read articles retrieved successfully',
            count: result.readArticles.length,
            ...result
        });
    } catch (error) {
        console.error("Error fetching read articles:", error.message);
        return res.status(500).json({
            error: error.message
        });
    }
});

// Get all favorite articles
router.get('/favorites', authenticateToken, async (req, res) => {
    try {
        const userId = req.decodedToken.id;
        const result = await getFavoriteArticles(userId);
        
        return res.status(200).json({
            message: 'Favorite articles retrieved successfully',
            count: result.favoriteArticles.length,
            ...result
        });
    } catch (error) {
        console.error("Error fetching favorite articles:", error.message);
        return res.status(500).json({
            error: error.message
        });
    }
});

// Search for news articles by keyword
router.get('/search/:keyword', authenticateToken, async (req, res) => {
    try {
        const userId = req.decodedToken.id;
        const keyword = req.params.keyword;
        
        if (!keyword || keyword.trim().length === 0) {
            return res.status(400).json({
                error: 'Search keyword is required'
            });
        }
        
        const result = await searchNews(userId, keyword.trim());
        
        return res.status(200).json({
            message: result.fromCache ? 'Search results retrieved from cache' : 'Search results fetched from API',
            ...result
        });
    } catch (error) {
        console.error("Error searching news:", error.message);
        return res.status(500).json({
            error: error.message
        });
    }
});

module.exports = router;
