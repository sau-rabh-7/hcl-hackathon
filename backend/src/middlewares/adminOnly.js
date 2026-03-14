export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ error: 'FORBIDDEN', message: 'Admin access required.' });
  }
};
