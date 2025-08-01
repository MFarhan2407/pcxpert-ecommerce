function isLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', 'Silakan login terlebih dahulu');
    return res.redirect('/login');
  }

  next();
}

module.exports = isLogin;
