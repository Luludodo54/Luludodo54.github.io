// SIMPLE RECOMMENDATION ALGO (YouTube/TikTok style)

let videos = [];

function scoreVideo(video, user) {
    let score = 0;

    score += video.views * 0.1;
    score += video.likes * 2;

    if (user.following.includes(video.authorId)) {
        score += 50;
    }

    return score;
}

function recommend(videos, user) {
    return videos
        .map(v => ({
            ...v,
            score: scoreVideo(v, user)
        }))
        .sort((a, b) => b.score - a.score);
}

module.exports = { recommend };
