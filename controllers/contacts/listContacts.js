const { Contact } = require("../../models/contact");

const listContacts = async (req, res) => {
  const { id: owner } = req.user;
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;
  const result = await Contact.find(
    favorite === "false" || favorite === "true"
      ? {
          owner,
          favorite,
        }
      : {
          owner,
        },
    "-createdAt -updatedAt",
    {
      skip,
      limit: Number(limit),
    }
  ).populate("owner", "email");
  console.log(favorite);
  res.json(result);
};

module.exports = listContacts;
