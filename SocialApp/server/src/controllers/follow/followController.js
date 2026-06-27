let follows = [];

exports.follow = (req, res) => {
    const { userId, targetId } = req.body;

    follows.push({ userId, targetId });

    res.json({ message: "Followed" });
};

exports.getFollowers = (req, res) => {
    const { userId } = req.params;

    const list = follows.filter(f => f.targetId == userId);

    res.json(list);
};
