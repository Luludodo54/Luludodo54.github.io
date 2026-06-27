let likes = [];

exports.like = (req, res) => {
    const { userId, videoId } = req.body;

    likes.push({ userId, videoId });

    res.json({ message: "Liked" });
};
