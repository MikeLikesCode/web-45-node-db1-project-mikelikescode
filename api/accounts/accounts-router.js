const router = require("express").Router();
const Accounts = require("./accounts-model");
const {
  checkAccountPayload,
  checkAccountId,
  checkAccountNameUnique,
} = require("./accounts-middleware");

router.get("/", async (req, res, next) => {
  try {
    const accounts = await Accounts.getAll();
    res.status(200).json(accounts);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", checkAccountId, async (req, res, next) => {
  res.json(req.account);
});

router.post(
  "/",
  checkAccountPayload,
  checkAccountNameUnique,
  (req, res, next) => {
    const newAccount = {
      name: req.body.name.trim(),
      budget: req.body.budget,
    };

    Accounts.create(newAccount)
      .then((all) => {
        console.log(all);
        res.status(201).json(all);
      })
      .catch(next);
  }
);

router.put(
  "/:id",
  checkAccountId,
  checkAccountPayload,
  async (req, res, next) => {
    try {
      await Accounts.updateById(req.params.id, req.body);
      res.status(200).json(req.body);
    } catch (err) {
      next(err);
    }
  }
);

router.delete("/:id", checkAccountId, async (req, res, next) => {
  try {
    const deletedAccount = await Accounts.deleteById(req.params.id);
    res.status(200).json(deletedAccount);
  } catch (err) {
    next(err);
  }
});

// eslint-disable-next-line
router.use((err, req, res, next) => {
  console.log(err.message);
  res.status(err.status || 500).json({
    message: err.message,
    customMessage: "Something bad inside the accounts router!",
  });
});

module.exports = router;
