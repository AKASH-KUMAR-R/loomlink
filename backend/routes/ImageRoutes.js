
const express = require('express');
const multer = require('multer');

const {
    addImageToFirebase,
    getImage,
    getAllImages,
    deleteImage,
} = require('../Controllers/ImageAccessController');

const upload = multer({
    limits:{
        fileSize: 10 * 1024 * 1024,
    },
});

const app = express();


app.get('/:imageId', getImage);
app.get('/gallery/:userId', getAllImages);
app.post('/upload', upload.single('image'),addImageToFirebase);
app.delete('/delete/:imageId', deleteImage);


module.exports = app;