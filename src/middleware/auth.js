const adminCredentials = {
  username: 'admin',
  password: 'password123'
};

const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'your_secret_key';

const authenticate = (req, res) => {
  const { username, password } = req.body;

  if (username === adminCredentials.username && password === adminCredentials.password) {
    const token = jwt.sign(
      { username, rol: 'admin' }, // Token con rol de admin 
      secretKey,
      { expiresIn: '8h' }
    );
    return res.json({ token });
  }

  return res.status(401).json({ message: 'Creedenciales invalidas' });
};

module.exports = { authenticate };