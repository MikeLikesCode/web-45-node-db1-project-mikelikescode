const Accounts = require("./accounts-model");
const db = require("../../data/db-config");

exports.checkAccountPayload = (req, res, next) => {
  if (req.body.name === undefined || req.body.budget === undefined) {
    res.status(400).json({ message: "name and budget are required" });
  } else if (typeof req.body.name !== "string") {
    res.status(400).json({ message: "name of account must be a string" });
  } else if (
    req.body.name.trim().length < 3 ||
    req.body.name.trim().length > 100
  ) {
    res
      .status(400)
      .json({ message: "name of account must be between 3 and 100" });
  } else if (typeof req.body.budget !== "number") {
    res.status(400).json({ message: "budget of account must be a number" });
  } else if (req.body.budget < 0 || req.body.budget > 1000000) {
    res
      .status(400)
      .json({ message: "budget of account is too large or too small" });
  } else {
    next();
  }
};

exports.checkAccountNameUnique = async (req, res, next) => {
  try {
    const checkName = await db("accounts")
      .where("name", req.body.name.trim())
      .first();
    if (checkName) {
      next({ status: 400, message: "name is taken" });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

exports.checkAccountId = (req, res, next) => {
  Accounts.getById(req.params.id)
    .then((account) => {
      if (!account) {
        next({ message: "account not found", status: 404 });
      } else {
        req.account = account;
        next();
      }
    })
    .catch(next);
};
