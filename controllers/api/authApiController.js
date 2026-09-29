const userModel = require("../../models/userModel");

async function login(req, res) {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const user = await userModel.findUserByUsernameAndPassword(
      username,
      password
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Sai username hoặc password"
      });
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      fullname: user.fullname
    };

    res.json({
      success: true,
      message: "Đăng nhập thành công",
      user: req.session.user
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi đăng nhập"
    });
  }
}

function logout(req, res) {
  req.session.destroy(() => {
    res.json({
      success: true,
      message: "Đăng xuất thành công"
    });
  });
}

function me(req, res) {
  if (!req.session.user) {
    return res.status(401).json({
      success: false,
      message: "Chưa đăng nhập"
    });
  }

  res.json({
    success: true,
    user: req.session.user
  });
}

module.exports = {
  login,
  logout,
  me
};
