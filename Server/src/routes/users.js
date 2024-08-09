const express = require('express');
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} = require('../controllers/userController');

const router = express.Router();
router.get('/:id',getUserById);
router.get('/',getAllUsers);
router.post('/',createUser);
router.put('/:id',updateUser);
router.delete('/:id',deleteUser);
module.exports = router;