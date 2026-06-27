let comments = [];

exports.addComment = (req, res) => {
    const { userId, videoId, text } = req.body;

    const comment = {
        id: Date.now(),
        userId,
        videoId,
        text,
        replies: []
    };

    comments.push(comment);

    res.json(comment);
};

exports.replyComment = (req, res) => {
    const { commentId, text } = req.body;

    const comment = comments.find(c => c.id == commentId);

    if (comment) {
        comment.replies.push({ text });
    }

    res.json(comment);
};
