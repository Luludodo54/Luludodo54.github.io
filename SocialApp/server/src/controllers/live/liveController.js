let lives = {};

exports.startLive = (req, res) => {
    const { userId } = req.body;

    const liveId = Date.now();

    lives[liveId] = {
        id: liveId,
        host: userId,
        viewers: 0,
        messages: []
    };

    res.json({ message: "Live started", liveId });
};

exports.stopLive = (req, res) => {
    const { liveId } = req.body;

    delete lives[liveId];

    res.json({ message: "Live stopped" });
};

exports.getLive = (req, res) => {
    const { liveId } = req.params;

    res.json(lives[liveId]);
};
