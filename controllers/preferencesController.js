const prisma = require('../prisma/prismaClient');


const getPreferences = async (id) => {
    try {

        const preferences = await prisma.preferences.findUnique({
            where: { userId: parseInt(id) },
            select: {
                categories: true,
                language: true,
            },
        });
        if (!preferences) {
            throw new Error('Preferences not found');
        };
        return {
            userId: id,
            categories: JSON.parse(preferences.categories), // Parse JSON string back to array
            language: preferences.language,
        }
    }
    catch (error) {
        return { error: error.message };
    }
}


const updatePreferences = async (id, categories, languages) => {
    try {
        const preferences = await prisma.preferences.upsert({
            where: { userId: id },
            update: {
                categories: JSON.stringify(categories), // Store as JSON string
                language: languages,
            },
            create: {
                userId: id,
                categories: JSON.stringify(categories), // Store as JSON string
                language: languages,
            },
        });
        return {
            userId: id,
            categories: JSON.parse(preferences.categories), // Parse JSON string back to array
            language: preferences.language,
        };
    } catch (error) {
        return { error: error.message };
    }
}

module.exports = {
    getPreferences,
    updatePreferences,
};
