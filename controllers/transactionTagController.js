const TransactionTag = require('../database/controllers/transactionTag');

exports.create = async (req, res) => {
    let result = await TransactionTag.create({
        "userId": req.user.id,
        "transactionId": req.params.transactionId,
        "tagId": req.body.tagId,
    })
    res.status(result.success ? 200 : 400).json(result);
}

exports.find = async (req, res) => {
    let result = await TransactionTag.find(req.params.transactionTagId)
    if(result.success && result.transactionTag.userId != req.user.id) { 
        return res.status(401).json({ success: false, error: "unauthorized" });
    }
    res.status(result.success ? 200 : 400).json(result)
}

exports.listByUser = async (req, res) => {
    result = await TransactionTag.get({userId: req.user.id})
    res.status(result.success ? 200 : 400).json(result)
}

exports.listByTransaction = async (req, res) => {
    result = await TransactionTag.list({transactionId: req.params.transactionId})
    if(result.success && result.transactionTag.userId != req.user.id) { 
        return res.status(401).json({ success: false, error: "unauthorized" });
    }
    res.status(result.success ? 200 : 400).json(result)
}

exports.update = async (req, res) => {
    let { success, transactionTag, error } = await TransactionTag.find(req.params.transactionTagId)
    if(!success) { 
        return res.status(400).json({ success: false, error: error }) 
    } else if(transactionTag.userId != req.user.id) { 
        return res.status(401).json({ success: false, error: "unauthorized" }); 
    }
    result = await TransactionTag.update(transactionTag, req.body)
    res.status(result.success ? 200 : 400).json(result)
}

exports.deleteTransactionTag = async (req, res) => {
    result = await transactionTagsDB.delete(req.transactionTag.id)
    res.status(result.success ? 200 : 400).json(result)
}