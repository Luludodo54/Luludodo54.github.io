const { users } = require("../models/User");
const jwt = require("jsonwebtoken");

const SECRET = "supersecretkey";

exports.register = (req, res) => {
    const { username, email, password } = req.body;

    const user = { id: Date.now(), username, email, password };
    users.push(user);

    res.json({ message: "User created", user });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, SECRET);

    res.json({ message: "Login success", token });
};
