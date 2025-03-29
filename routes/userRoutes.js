const express = require('express');
const { createUser, getUsers, getUserById, deleteUser, loginUser } = require('../controllers/userController');
const { hashPassword, authenticateToken } = require('../middlewares/authMiddleware');


const router = express.Router();


// router.post('/', hashPassword, createUser);
// router.get('/', getUsers);
// router.get('/:id', getUserById);
// router.delete('/:id', deleteUser);
router.post('/signup', hashPassword, async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await createUser(name, email, password);
        delete user.password;
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
);
router.get('/', async (req, res) => {
    try {
        const users = await getUsers();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
);
router.get('/:id', async (req, res) => {
    const { id } = req.user.id;
    try {
        const user = await getUserById(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
);
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await deleteUser(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
);
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await loginUser(email, password);

        if (!token) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        res.status(200).send({ token: token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
);

module.exports = router;
