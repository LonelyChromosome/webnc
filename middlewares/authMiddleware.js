function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  next();
}

function usesession(req, res, next) {
  res.locals.user = req.session.user || null;
  next();
}

function requireApiLogin(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({
      success: false,
      message: "Bạn cần đăng nhập để thực hiện chức năng này"
    });
  }

  next();
}

module.exports = {
  requireLogin,
  usesession,
  requireApiLogin
};
