const jwt = require("jsonwebtoken");

const secretKey = "d0fb440693a0acc3a72f6b3db5460c14";

const findEmailUser = (email) => {
  if (email != "fikrihaikal568@gmail.com") {
    return false;
  }
  return email;
};

const login = async (req, res) => {
  let existingUser;
  try {
    existingUser = findEmailUser(req.body.email);
    if (!existingUser) {
      console.log(req.body.email);
      const error = "User Not found. please check your email";
      return res.status(404).json({ success: false, message: error });
    } else if ("haikal110599" != req.body.password) {
      const error = "password is wrong";
      return res.status(404).json({ success: false, message: error });
    }
  } catch (error) {
    return res.status(404).json({ success: false, message: error });
  }
  const token = jwt.sign({ email: existingUser }, secretKey);
  res.status(200).send({
    success: true,
    data: { existingUser, accessToken: token },
  });
};

const verifyToken = (req, res, next) => {
  req.headers.authorization
    ? jwt.verify(
        req.headers.authorization.split(" ")[1],
        secretKey,
        (err, decode) => {
          if (err) {
            return res
              .status(498)
              .send({ success: false, message: "Invalid Token" });
          }
          req.user = decode;
          next();
        }
      )
    : res
        .status(400)
        .send({ succes: false, message: "error! token was not provide" });
};

module.exports = {
  login,
  verifyToken,
};
