import React from 'react';

const YouTubePlayer = ({ videoUrl, title, width = '100%', height = '100%', style }) => {
    const extractVideoId = (url) => {
        const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[1].length === 11 ? match[1] : null;
    };

    const videoId = extractVideoId(videoUrl);

    if (!videoId) {
        return <div>No Video</div>;
    }

    return (
        <div style={{ width, height, ...style }}>
            <iframe
                title={title || "YouTube Video"}
                src={`https://www.youtube.com/embed/${videoId}`}
                frameBorder="0"
                allowFullScreen
                style={{ width: '100%', height: '100%', border: 'none' }}
            />
        </div>
    );
};

export default YouTubePlayer;
