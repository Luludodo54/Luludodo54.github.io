let mideos = [];

exports.addMideo = (req, res) => {
    const { url, caption } = req.body;

    const mideo = {
        id: Date.now(),
        url,
        caption,
        likes: 0
    };

    mideos.push(mideo);

    res.json(mideo);
};

exports.getMideos = (req, res) => {
    res.json(mideos);
};
