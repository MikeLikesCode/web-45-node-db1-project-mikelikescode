const Accounts = require('./accounts-model');

exports.checkAccountPayload = (req, res, next) => {
  const budget = req.body.budget.trim(); 
  const name = req.body.name.trim();
  if(!budget || !name ){
    res.status(400).json({ message: "name and budget are required" })
  }else if(req.body.name.length > 100 || req.body.name.length < 3){
    res.status(400).json({ message: "name of account must be between 3 and 100" })
  }else if(typeof name !== 'string'){
    res.status(400).json({ message: "name of account must be a string" })
  }else if(typeof(parseInt(budget)) !== 'number'){
    res.status(400).json({ message: "budget of account must be a number" })
  }else if(budget > 1000000 || budget < 0){
    res.status(400).json({ message: "budget of account is too large or too small" })
  }else{
    req.body.name = name
    next()
  }
}

exports.checkAccountNameUnique = (req, res, next) => {
  Accounts.getAll()
  .then(accounts => {
    accounts.filter( account => {
      if(account.name == req.params.name){
        next({ message: 'that name is already taken', status: 400})
      }
    })
  })
}

exports.checkAccountId = (req, res, next) => {
  Accounts.getById(req.params.id)
  .then(account => {
    if(!account){
      next({ message: 'account not found', status: 404})
    }
    else{
      req.account = account;
      next()
    }
  })
  .catch(next)
}
