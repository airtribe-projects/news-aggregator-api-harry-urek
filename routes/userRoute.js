const express = require('express');
const { createUser, getUsers, getUserById, deleteUser } = require('../controllers/userController');
const { hashPassword } = require('../middlewares/authMiddleware');


const router = express.Router();


router.post('/', hashPassword, createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.delete('/:id', deleteUser);

module.exports = router;
