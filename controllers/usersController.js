const User = require('../models/User');

const getAllUsers = async (req, res) => {
    const users = await User.find();
    if (!users) return res.status(204).json({ 'message': 'No users found' });
    res.json(users);
}

const createUser = async (req, res) => {
    if(!req?.body?.username || !req?.body?.password) {
        return res.status(400).json({ message: 'Username and Password are required'} ); // 400 Bad Request
    }
    try {
        const {username, password, roles} = req.body;
        userRoles  = roles || { User: 2001 };
        const user = await User.findOne({ username: username }).exec();
        if (user){
            return res.status(409).json({ message: 'Username already exists' }); // 409 Conflict
        }
        const newUser = new User({
            username: username,
            roles: roles,
            password: password,
        });
        const result = await User.create(newUser);
        return res.status(201).json(result);  // 201 Created
    } catch (error) {
        return res.status(500).json({message: error.message}); //! 500 Internal Server Error
    }
}

const deleteUser = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findById(req.body.id).exec();
    if (!user) {
        return res.status(404).json({ 'message': `User ID ${req.body.id} not found` }); // 404 Not Found
    }
    const result = await user.deleteOne({ _id: req.body.id });
    res.json(result);
}

const getUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findById(req.params.id).exec();
    if (!user) {
        return res.status(404).json({ 'message': `User ID ${req.params.id} not found` }); // 404 Not Found
    }
    return res.status(200).json(user);
}

module.exports = {
    getAllUsers,
    createUser,
    deleteUser,
    getUser
}


