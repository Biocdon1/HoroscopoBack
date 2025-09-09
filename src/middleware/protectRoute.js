const jwt = require('jsonwebtoken');

const protectRoute = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'Se requiere un token válido en formato Bearer <token>' });
  }

  const token = authHeader.split(' ')[1];
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    next();
  } catch (err) {
    res.status(401).json({
      mensaje: err.name === 'TokenExpiredError'
        ? 'El token ha expirado'
        : 'Token inválido o malformado'
    });
  }
};

const authorizeRoles = (...roles) => (req, res, next) =>
  roles.includes(req.usuario.rol)
    ? next()
    : res.status(403).json({ mensaje: 'Acceso denegado' });

module.exports = { protectRoute, authorizeRoles };