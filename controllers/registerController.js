const User = require('../models/User');
const bcrypt = require('bcrypt');

const handleRegister = async (req, res) => {
    const { username, password } = req.body;
    if(!username || !password) {
        res.status(400).json({message: 'Username and password are required'});
        return;
    }
    // check if username already exists in the database
    const user = await User.findOne({username: username}).exec();
    if(user) {
        res.sendStatus(409); // conflict
        return;
    }
    try {
        // encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // create and store the user in the database
        const newUser = new User({username: username, password: hashedPassword});
        const result = await User.create(newUser);
        console.log(result);
        res.status(201).json({'success': `New user ${username} has been created`}); 
    } catch (error) {
        res.status(500).json({message: error.message});
    }; 
}

module.exports = { handleRegister };


