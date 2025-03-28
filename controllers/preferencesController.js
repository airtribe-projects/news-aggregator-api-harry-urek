const prisma = require('../db/prismaClient');


const getPreferences = async (id) => {
    try {
        const preferences = await prisma.preferences.findUnique({
            where: { userId: id },
        });
        if (!preferences) {
            throw new Error('Preferences not found');
        };
        return user.preferences;
    }
    catch (error) {
        return { error: error.message };
    }
}


const updatePreferences = async (id, categories, languages) => {
    try {
        const preferences = await prisma.preferences.update({
            where: { userId: id },
            data: {
                categories: categories,
                languages: languages,
            },
        });
        return preferences;
    } catch (error) {
        return { error: error.message };
    }
}

module.exports = {
    getPreferences,
    updatePreferences,
};
