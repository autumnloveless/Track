const Account = require('../database/controllers/plaidAccount');
const auth = require('../middlewares/authenticate');

exports.find = async (req, res) => {
  result = await Account.find(req.params.id)
  if(result.success && result.account.userId != req.user.id) { 
    return res.status(401).json({ success: false, error: "unauthorized" });
  }
  res.status(result.success ? 200 : 400).json(result)
}

exports.listByUser = async (req, res) => {
  result = await Account.list({userId: req.user.id})
  res.status(result.success ? 200 : 400).json(result)
}

exports.update = async (req, res) => {
  let { success, account, error } = await Account.find(req.params.id)
  if(!success) { 
    return res.status(400).json({ success: false, error: error }) 
  } else if(account.userId != req.user.id) { 
    return res.status(401).json({ success: false, error: "unauthorized" }); 
  }
  result = await Account.update(account, req.body)
  res.status(result.success ? 200 : 400).json(result)
}