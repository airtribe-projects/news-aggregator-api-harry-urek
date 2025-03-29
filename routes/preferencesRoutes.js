const express = require('express');
const { getPreferences, updatePreferences } = require('../controllers/preferencesController');
const { authenticateToken } = require('../middlewares/authMiddleware');


const router = express.Router();


router.get('/', async (req, res) => {
    const userId = req.decodedToken.id;
    const preferences = await getPreferences(userId);
    if (preferences.error) {
        return res.status(500).json({ error: preferences.error });
    }
    return res.status(200).json(preferences);
}
);



router.put('/', async (req, res) => {
    const userId = req.decodedToken.id;
    const { categories, languages } = req.body;
    if (!categories || !languages) {
        return res.status(400).json({ error: "Categories and languages are required" }); // 400 Bad Request
    }
    const preferences = await updatePreferences(userId, categories, languages);
    if (preferences.error) {
        return res.status(500).json({ error: preferences.error });
    }
    return res.status(200).json(preferences);
});

module.exports = router;
