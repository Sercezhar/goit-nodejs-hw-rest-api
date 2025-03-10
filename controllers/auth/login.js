const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, authSchema } = require("../../models/user");
const { createError } = require("../../helpers");

const { SECRET_KEY } = process.env;

const login = async (req, res) => {
  const { error } = authSchema.validate(req.body);

  if (error) {
    throw createError(400, error.message);
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const comparePassword = await bcrypt.compare(password, user.password);

  if (!user || !comparePassword) {
    throw createError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw createError(401, "Email is not verified");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
    user: {
      email,
      subscription: user.subscription,
    },
  });
};

module.exports = login;
