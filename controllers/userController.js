const prisma = require('../prisma/prismaClient');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET


const createUser = async (name, email, password) => {
    try {
        const user = await prisma.user.create({
            data: { name, email, password },
        });
        return user;
    } catch (err) {
        throw new Error('Unable to create user');
    }
};


const getUsers = async () => {
    try {
        const users = await prisma.user.findMany();
        return users;
    } catch (err) {
        throw new Error('Unable to fetch users');
    }
};



const getUserById = async (id) => {

    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) }
        });
        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }
        return user;
    } catch (err) {
        return err;
    }
}


const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.delete({
            where: { id: parseInt(id) }
        });
        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }
        return user;
    } catch (err) {
        return err;
    }
}


const loginUser = async (email, password) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            throw new Error("User not found");
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new Error("Invalid password");
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        return token;
    }
    catch (err) {
        return err;
    }
}


module.exports = { createUser, getUsers, getUserById, deleteUser };
