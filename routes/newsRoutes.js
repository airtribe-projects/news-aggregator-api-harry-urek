const express = require('express');
const axios = require('axios');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { getPreferences } = require('../controllers/preferencesController');
const NEWS_API_KEY = process.env.NEWS_API_KEY;

const router = express.Router();
const NEWS_API_URL = "https://gnews.io/api/v4/top-headlines?";


router.get('/', authenticateToken, async (req, res) => {
    try {
        const id = req.decodedToken.id;
        const preferences = await getPreferences(id);


        if (preferences.error) {
            return res.status(400).json({ error: preferences.error });
        }
        const categories = Array.isArray(preferences.categories) ? preferences.categories : [preferences.categories];
        const language = preferences.language || 'en';

        const requests = categories.map(category => {
            const url = `${NEWS_API_URL}` + `category=${category}&lang=${language}&country=us&max=10&apikey=` + `${NEWS_API_KEY}`;
            return axios.get(url).catch(error => {
                console.error(`Error fetching news for category ${category}:`, error.message);
                return { data: { articles: [] } };
            });
        });
        const responses = await Promise.all(requests);

        let news = responses.flatMap((response) => response.data.articles).filter(Boolean);

        return res.status(200).send({ news: news });

    } catch (error) {
        console.error("Error fetching news:", error.response?.data || error.message);

        return res.status(error.response?.status || 500).json({
            error: error.response?.data?.message || "Internal Server Error",
        });
    }
});

module.exports = router;
