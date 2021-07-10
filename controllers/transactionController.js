const Transaction = require('../database/controllers/plaidTransaction');

exports.find = async (req, res) => {
  let result = await Transaction.find(req.params.transactionId)
  if(result.success && result.transaction.userId != req.user.id) { 
    return res.status(401).json({ success: false, error: "unauthorized" });
  }
  res.status(result.success ? 200 : 400).json(result)
}

exports.listByUser = async (req, res) => {
  result = await Transaction.list({userId: req.user.id})
  res.status(result.success ? 200 : 400).json(result)
}

exports.update = async (req, res) => {
  let { success, transaction, error } = await Transaction.find(req.params.transactionId)
  if(!success) { 
    return res.status(400).json({ success: false, error: error }) 
  } else if(transaction.userId != req.user.id) { 
    return res.status(401).json({ success: false, error: "unauthorized" }); 
  }
  result = await Transaction.update(transaction, req.body)
  res.status(result.success ? 200 : 400).json(result)
}