const prisma = require('../prisma/prismaClient');


const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await prisma.user.create({
            data: { name, email, password },

        });
        return res.status(201).json(user);
    } catch (err) {
        return res.status(500).json({ error: 'Unable to create user' });
    }
};


const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).json({ error: 'Unable to fetch users' });
    }
};



const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) }
        });
        if (!user) {
            return res.status(404).json({ error: `User with id ${id} not found` });
        }
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({ error: 'Unable to fetch user' });
    }
}


const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.delete({
            where: { id: parseInt(id) }
        });
        if (!user) {
            res.status(404).json({ error: `User with id ${id} not found` });
        }
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({ error: 'Unable to delete user' });
    }
}

module.exports = { createUser, getUsers, getUserById, deleteUser };