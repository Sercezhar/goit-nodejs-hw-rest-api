const { User, verifyEmailSchema } = require("../../models/user");
const { createError, sendEmail } = require("../../helpers");

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const { error } = verifyEmailSchema.validate({ email });

  if (error) {
    throw createError(400, error.message);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw createError(404);
  }

  if (user.verify) {
    throw createError(400, "Verification has already been passed");
  }

  const mail = {
    to: email,
    subject: "Please confirm your email address",
    html: `<a target="_blank" href="http://localhost:3000/api/auth/verify/${user.verificationToken}">Confirm email</a>`,
  };

  await sendEmail(mail);
  res.json({
    message: "Verification email sent",
  });
};

module.exports = resendVerifyEmail;
