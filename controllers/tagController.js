const Tag = require('../database/controllers/tag');

exports.create = async (req, res) => {
    let result = await Tag.create({
        "name": req.body.title,
        "userId": req.user.id,
    })
    res.status(result.success ? 200 : 400).json(result);
}

exports.find = async (req, res) => {
    let result = await Tag.find(req.params.tagId)
    if(result.success && result.tag.userId != req.user.id) { 
        return res.status(401).json({ success: false, error: "unauthorized" });
    }
    res.status(result.success ? 200 : 400).json(result)
}

exports.listByUser = async (req, res) => {
    result = await Tag.list({userId: req.user.id})
    res.status(result.success ? 200 : 400).json(result)
}

exports.update = async (req, res) => {
    let { success, tag, error } = await Tag.find(req.params.tagId)
    if(!success) { 
        return res.status(400).json({ success: false, error: error }) 
    } else if(tag.userId != req.user.id) { 
        return res.status(401).json({ success: false, error: "unauthorized" }); 
    }
    result = await Tag.update(tag, req.body)
    res.status(result.success ? 200 : 400).json(result)
}

exports.deleteTag = async (req, res) => {
    result = await tagsDB.delete(req.tag.id)
    res.status(result.success ? 200 : 400).json(result)
}