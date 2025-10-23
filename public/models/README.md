# Face Detection AI Models

This directory should contain the face-api.js pre-trained models for face detection functionality.

## Required Models

Download the following models from the face-api.js repository and place them in this directory:

1. **tiny_face_detector_model-weights_manifest.json**
2. **tiny_face_detector_model-shard1**
3. **face_landmark_68_model-weights_manifest.json**
4. **face_landmark_68_model-shard1**
5. **face_expression_model-weights_manifest.json**
6. **face_expression_model-shard1**
7. **age_gender_model-weights_manifest.json**
8. **age_gender_model-shard1**

## Download Instructions

You can download these models from:
- Official face-api.js repository: https://github.com/justadudewhohacks/face-api.js/tree/master/weights
- Or use the CDN links in development mode

## File Structure

```
public/models/
├── tiny_face_detector_model-weights_manifest.json
├── tiny_face_detector_model-shard1
├── face_landmark_68_model-weights_manifest.json
├── face_landmark_68_model-shard1
├── face_expression_model-weights_manifest.json
├── face_expression_model-shard1
├── age_gender_model-weights_manifest.json
├── age_gender_model-shard1
└── README.md
```

## Usage

The models are loaded automatically by the VideoPreview component when the interview session starts.

## Note

For development purposes, the application will continue to work without these models, but face detection features will be disabled.
