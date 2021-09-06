const router = require('express').Router()
const Accounts = require('./accounts-model');
const { checkAccountPayload, checkAccountId, checkAccountNameUnique } = require('./accounts-middleware');

router.get('/', async (req, res, next) => {
  try{
    const accounts = await Accounts.getAll();
    res.status(200).json(accounts);
  }
  catch(err){
    next(err)
  }
})

router.get('/:id', checkAccountId, async (req, res, next) => {
  res.json(req.account);
})

router.post('/', checkAccountPayload, checkAccountNameUnique,  async(req, res, next) => {
  try{
    const accounts = await Accounts.create(req.body);
    res.status(201).json(accounts );    
  }
  catch(err){
    next(err)
  }
})

router.put('/:id', checkAccountId, checkAccountPayload, async (req, res, next) => {
  try{
    const response = Accounts.updateById(req.params.id, req.body);
    res.status(200).json(response)
  }
  catch(err){
    next(err)
  }
});

router.delete('/:id', (req, res, next) => {
  // DO YOUR MAGIC
})

// eslint-disable-next-line
router.use((err, req, res, next) => {
  console.log(err.message);
  res.status(err.status || 500).json({
    message: err.message,
    customMessage: "Something bad inside the accounts router!",
  });
});

module.exports = router;
