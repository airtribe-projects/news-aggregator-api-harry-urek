const prisma = require('../prisma/prismaClient');
const CacheService = require('../services/cacheService');
const axios = require('axios');
const { getPreferences } = require('./preferencesController');

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_URL = "https://gnews.io/api/v4/top-headlines?";

// Generate unique article ID from URL or title
const generateArticleId = (article) => {
    return Buffer.from(article.url || article.title).toString('base64').slice(0, 32);
};

const fetchNewsFromAPI = async (category, language, page = 1, maxResults = 10) => {
    try {
        const url = `${NEWS_API_URL}category=${category}&lang=${language}&country=us&max=${maxResults}&apikey=${NEWS_API_KEY}`;
        const response = await axios.get(url);
        
        // Add unique IDs to articles
        const articlesWithIds = response.data.articles.map(article => ({
            ...article,
            id: generateArticleId(article)
        }));
        
        return {
            articles: articlesWithIds,
            totalArticles: response.data.totalArticles || articlesWithIds.length
        };
    } catch (error) {
        console.error(`Error fetching news for category ${category}:`, error.message);
        return { articles: [], totalArticles: 0 };
    }
};

const getNews = async (userId) => {
    try {
        const preferences = await getPreferences(userId);
        
        if (preferences.error) {
            throw new Error(preferences.error);
        }
        
        const categories = Array.isArray(preferences.categories) ? preferences.categories : [preferences.categories];
        const language = preferences.language || 'en';
        
        // Generate cache key
        const cacheKey = `news_${userId}_${categories.join('_')}_${language}`;
        
        // Try to get from cache first
        let cachedNews = await CacheService.get(cacheKey);
        if (cachedNews) {
            return { ...cachedNews, fromCache: true };
        }
        
        // If not in cache, fetch from external API
        const requests = categories.map(category => fetchNewsFromAPI(category, language));
        const responses = await Promise.all(requests);
        
        const allArticles = responses.flatMap(response => response.articles);
        
        // Remove duplicates based on URL
        const uniqueArticles = allArticles.filter((article, index, self) => 
            index === self.findIndex(a => a.url === article.url)
        );
        
        const result = {
            news: uniqueArticles,
            totalArticles: uniqueArticles.length
        };
        
        // Cache the result for 30 minutes
        await CacheService.set(cacheKey, result, 1800);
        
        return { ...result, fromCache: false };
    } catch (error) {
        throw new Error(`Error fetching news: ${error.message}`);
    }
};

const markAsRead = async (userId, articleId, articleData = {}) => {
    try {
        const readArticle = await prisma.readArticle.upsert({
            where: {
                userId_articleId: {
                    userId: parseInt(userId),
                    articleId: articleId
                }
            },
            update: {
                readAt: new Date()
            },
            create: {
                userId: parseInt(userId),
                articleId: articleId,
                title: articleData.title || 'Unknown Title',
                url: articleData.url || '',
                readAt: new Date()
            }
        });
        
        return { success: true, readArticle };
    } catch (error) {
        throw new Error(`Error marking article as read: ${error.message}`);
    }
};

const markAsFavorite = async (userId, articleId, articleData = {}) => {
    try {
        const favoriteArticle = await prisma.favoriteArticle.upsert({
            where: {
                userId_articleId: {
                    userId: parseInt(userId),
                    articleId: articleId
                }
            },
            update: {
                favoriteAt: new Date()
            },
            create: {
                userId: parseInt(userId),
                articleId: articleId,
                title: articleData.title || 'Unknown Title',
                url: articleData.url || '',
                description: articleData.description || null,
                imageUrl: articleData.image || null,
                favoriteAt: new Date()
            }
        });
        
        return { success: true, favoriteArticle };
    } catch (error) {
        throw new Error(`Error marking article as favorite: ${error.message}`);
    }
};

const getReadArticles = async (userId) => {
    try {
        const readArticles = await prisma.readArticle.findMany({
            where: { userId: parseInt(userId) },
            orderBy: { readAt: 'desc' }
        });
        
        return { readArticles };
    } catch (error) {
        throw new Error(`Error fetching read articles: ${error.message}`);
    }
};

const getFavoriteArticles = async (userId) => {
    try {
        const favoriteArticles = await prisma.favoriteArticle.findMany({
            where: { userId: parseInt(userId) },
            orderBy: { favoriteAt: 'desc' }
        });
        
        return { favoriteArticles };
    } catch (error) {
        throw new Error(`Error fetching favorite articles: ${error.message}`);
    }
};

const searchNews = async (userId, keyword) => {
    try {
        const preferences = await getPreferences(userId);
        
        if (preferences.error) {
            throw new Error(preferences.error);
        }
        
        const language = preferences.language || 'en';
        
        // Generate cache key for search
        const cacheKey = `search_${userId}_${keyword}_${language}`;
        
        // Try to get from cache first
        let cachedResults = await CacheService.get(cacheKey);
        if (cachedResults) {
            return { ...cachedResults, fromCache: true };
        }
        
        // Search using GNews API
        const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(keyword)}&lang=${language}&country=us&max=20&apikey=${NEWS_API_KEY}`;
        const response = await axios.get(url);
        
        const articlesWithIds = response.data.articles.map(article => ({
            ...article,
            id: generateArticleId(article)
        }));
        
        const result = {
            articles: articlesWithIds,
            keyword: keyword,
            totalArticles: response.data.totalArticles || articlesWithIds.length
        };
        
        // Cache search results for 15 minutes
        await CacheService.set(cacheKey, result, 900);
        
        return { ...result, fromCache: false };
    } catch (error) {
        throw new Error(`Error searching news: ${error.message}`);
    }
};

const updateCacheInBackground = async () => {
    try {
        console.log('Starting background cache update...');
        
        // Get all users with preferences
        const users = await prisma.user.findMany({
            include: { preferences: true }
        });
        
        for (const user of users) {
            if (user.preferences) {
                try {
                    await getNews(user.id);
                    console.log(`Updated cache for user ${user.id}`);
                } catch (error) {
                    console.error(`Failed to update cache for user ${user.id}:`, error.message);
                }
            }
        }
        
        console.log('Background cache update completed');
    } catch (error) {
        console.error('Background cache update failed:', error.message);
    }
};

module.exports = {
    getNews,
    markAsRead,
    markAsFavorite,
    getReadArticles,
    getFavoriteArticles,
    searchNews,
    updateCacheInBackground
};