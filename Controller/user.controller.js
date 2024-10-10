const User = require('../Model/user.model')
const bcryptjs = require('bcrypt')

const signup = async (req, res) => {
    try {
        const { fullname, email, password , role } = req.body;

        // Validate input
        if (!fullname || !email || !password ) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashPassword = await bcryptjs.hash(password, 10);
        
        // Create the user
        const createdUser = new User({
            fullname: fullname,
            email: email,
            password: hashPassword,
            role: role
        });

        await createdUser.save();

        res.status(201).json({
            message: "User created successfully",
            user: {
                _id: createdUser._id,
                fullname: createdUser.fullname,
                email: createdUser.email,
                role: createdUser.role,
            },
        });
        console.log(createdUser)
    } catch (error) {
        console.error("Error: " + error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

const login = async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!user || !isMatch) {
            return res.status(400).json({ message: "Invalid username or password" });
        } else {
            res.status(200).json({
                message: "Login successful",
                user: {
                    _id: user._id,
                    fullname: user.fullname,
                    email: user.email,
                },
            });
        }
    } catch (error) {
        console.log("Error: " + error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { signup, login };