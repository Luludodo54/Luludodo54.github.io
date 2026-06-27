let videos = [];

exports.uploadVideo = (req, res) => {
    const { title, url } = req.body;

    const video = {
        id: Date.now(),
        title,
        url,
        views: 0,
        likes: 0
    };

    videos.push(video);

    res.json(video);
};

exports.getVideos = (req, res) => {
    res.json(videos);
};
