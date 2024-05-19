const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const imageDataSchema = new Schema({
    image_id: {
        type: String,
        required: true,
        unique: true,
    },
    user_id: {
        type: String,
        required: false,
    },
    originalname: {
        type: String,
        required: true,
    },
    image_url: {
        type: String,
        required: true,
    },
    redirect_url: {
        type: String,
        required: true,
    },
    file_name: {
        type: String,
        required: true,
    },
    expireAt: {
        type: Date,
        required: false,
    }
    
},{ timestamps: true});

module.exports = mongoose.model('imageDataModel', imageDataSchema);
// fieldname: req.file.fieldname,
// originalname: req.file.originalname,
// encoding: req.file.encoding,
// mimetype: req.file.mimetype,
// buffer: req.file.buffer,
// size: req.file.size