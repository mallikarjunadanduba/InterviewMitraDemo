import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import * as faceapi from 'face-api.js';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';


const VideoPreview = ({ stream }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [warningCount, setWarningCount] = useState(0);
    const warningCountRef = useRef(0);
    const [showWarning, setShowWarning] = useState(false);
    const [multiFaceFrameCount, setMultiFaceFrameCount] = useState(0);

    useEffect(() => {
        const MODEL_URL = '/models';
        const loadModels = async () => {
            try {
                await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
                await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
                console.log('✅ Face API models loaded');
            } catch (e) {
                console.error('Failed loading Face API models', e);
            }
        };
        loadModels();
    }, []);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    useEffect(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const onPlay = () => {
            const displaySize = {
                width: video.videoWidth,
                height: video.videoHeight,
            };
            faceapi.matchDimensions(canvas, displaySize);

            const interval = setInterval(async () => {
                // ensure models are loaded before inference
                if (!faceapi.nets.tinyFaceDetector.params || !faceapi.nets.faceLandmark68Net.params) {
                    return;
                }
                const detections = await faceapi
                    .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks();

                // Logic only, no drawings
                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Remove visual overlays (drawings)
                // faceapi.draw.drawDetections(canvas, resizedDetections);
                // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

                // Multi-face detection logic
                if (detections.length > 1) {
                    setMultiFaceFrameCount(prev => {
                        const next = prev + 1;

                        if (next >= 6) {
                            const newCount = warningCountRef.current + 1;

                            if (newCount <= 3) {
                                setShowWarning(true);
                                setWarningCount(newCount);
                                warningCountRef.current = newCount;

                                if (newCount >= 3) {
                                    alert('❌ Multiple faces detected 3 times. Ending session.');
                                    if (stream) {
                                        stream.getTracks().forEach(track => track.stop());
                                    }
                                    clearInterval(interval);
                                }

                                setTimeout(() => setShowWarning(false), 1000);
                            }

                            return 0;
                        }

                        return next;
                    });
                } else {
                    setMultiFaceFrameCount(0);
                }
            }, 300);

            return () => clearInterval(interval);
        };

        video.addEventListener('loadeddata', onPlay);
        return () => video.removeEventListener('loadeddata', onPlay);
    }, [stream]);

    return (
        <Box mt={2} position="relative">
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    objectFit: 'cover',
                }}
            />
            <canvas
                ref={canvasRef}
                width={640}
                height={480}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                }}
            />
            <Dialog open={showWarning && warningCount < 3} onClose={() => setShowWarning(false)}>
                <DialogTitle>⚠️ Multiple Faces Detected</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Please ensure only one person is visible in the frame.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowWarning(false)} color="primary" variant="contained">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default VideoPreview;
