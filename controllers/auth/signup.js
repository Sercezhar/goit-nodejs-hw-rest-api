const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const { User, authSchema } = require("../../models/user");
const { createError } = require("../../helpers");

const signup = async (req, res) => {
  const { error } = authSchema.validate(req.body);

  if (error) {
    throw createError(400, error.message);
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw createError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const result = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

  res.status(201).json({
    user: {
      email: result.email,
      subscription: result.subscription,
    },
  });
};

module.exports = signup;
