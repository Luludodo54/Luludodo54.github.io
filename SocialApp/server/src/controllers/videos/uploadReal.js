const fs = require("fs");

let videos = [];

exports.uploadFile = (req, res) => {
    if (!req.file) return res.status(400).send("No file");

    const video = {
        id: Date.now(),
        title: req.body.title,
        file: req.file.filename,
        views: 0,
        likes: 0
    };

    videos.push(video);

    res.json(video);
};
