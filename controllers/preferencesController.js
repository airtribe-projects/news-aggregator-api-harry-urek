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
        return preferences;
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
                categories: categories,
                language: languages,
            },
            create: {
                userId: id,
                categories: categories,
                language: languages,
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
