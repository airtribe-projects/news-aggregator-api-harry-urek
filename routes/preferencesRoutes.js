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
    // Return in format expected by tests
    return res.status(200).json({ 
        preferences: preferences.categories 
    });
}
);



router.put('/', async (req, res) => {
    const userId = req.decodedToken.id;
    const { preferences, categories, languages } = req.body;
    
    // Support both old format (preferences) and new format (categories, languages)
    const finalCategories = preferences || categories;
    const finalLanguages = languages || 'en';
    
    if (!finalCategories) {
        return res.status(400).json({ error: "Categories are required" });
    }
    
    const result = await updatePreferences(userId, finalCategories, finalLanguages);
    if (result.error) {
        return res.status(500).json({ error: result.error });
    }
    return res.status(200).json(result);
});

module.exports = router;
