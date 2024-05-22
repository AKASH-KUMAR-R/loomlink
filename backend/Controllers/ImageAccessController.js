
const mongoose = require('mongoose');
const cron = require('node-cron');
const {v4: uuid} = require('uuid');

const ImageModel = require('../Model/ImageModel');

const admin = require('../FirebaseConfig/firebaseAdmin')

const bucket = admin.storage().bucket();

const MILLISECONDS_IN_A_SECOND = 1000;
const SECONDS_IN_A_MINUTE = 60;
const MINUTES_IN_AN_HOUR = 60;
const HOURS_IN_A_DAY = 24;

const ONE_DAY_IN_MILLISECONDS = HOURS_IN_A_DAY * MINUTES_IN_AN_HOUR * SECONDS_IN_A_MINUTE * MILLISECONDS_IN_A_SECOND;

const addImageToFirebase = async (req, res) => {

    try {

        const file = req.file;
        const {user_id} = req.body;

        const newFilename = `${Date.now()}-${file.originalname}`;
        const imageFile = bucket.file(newFilename);

        const stream = imageFile.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            }
        });

        stream.on('error', (error) => {
            console.error("Something wrong happened during upload", error);
            res.status(500).json({ message: "Server failed to upload image" });
        });

        stream.on('finish',  () => {
            imageFile.makePublic().then( async () => {

                const redirectUrl = `https://storage.googleapis.com/${bucket.name}/${imageFile.name}`;
                const uniqueId = uuid();
                const imageUrl = `https://loomlink-api.vercel.app/image/${uniqueId}`;

                const expireAt = new Date((new Date).getTime() + ONE_DAY_IN_MILLISECONDS);
                
                const imageDetails = await ImageModel.create({ user_id:user_id, image_id:uniqueId ,originalname: file.originalname, image_url:imageUrl, redirect_url: redirectUrl, file_name: newFilename, expireAt:user_id ? undefined : expireAt });
                
                if (!imageDetails) {
                    res.status(500).json({message: "Failed to upload details to mongodb"});
                } else {
                    res.status(200).json({image_url: imageUrl});
                }
                
            });
        });

        stream.end(file.buffer);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to Upload to firebase" });
    }

};

const getImage = async (req, res) => {

    try {
        const { imageId } = req.params;

        const redirect_url = await ImageModel.findOne({image_id: imageId}, { _id: 0,redirect_url: 1});

        if (!redirect_url) {
            res.status(404).json({message: "Image not found"});
        } else {
            res.redirect(redirect_url.redirect_url);
        }
            
    } catch (err)  {
        console.error(err);
    }
}

const getAllImages = async (req, res) => {

    try {

        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(404).json({message: "Invalid user key"});
        }

        const imageUrls = await ImageModel.find({user_id: userId}, {_id: 0, image_url: 1, image_id: 1});

        if (imageUrls.length > 0) {
            res.status(200).json({message:"Images founded", image_urls: imageUrls});
        } else {
            res.status(200).json({message:"No image found", image_urls: imageUrls});
        }

    } catch(err) {
        res.status(500).json({message: "Server side error"});
    }
}

const deleteImage = async (req, res) => {

    const { imageId } = req.params;

    try {
        
        const deleteImageData = await ImageModel.findOneAndDelete({image_id: imageId});
        if (deleteImageData) {

            const file = bucket.file(deleteImageData.file_name);

                file.delete()
                .then( () => {
                    res.status(200).json({message: "Image deleted successfully"});
                })
                .catch( (err) => {
                    res.status(500).json({message: "Firebase file deletion failed"});
                    console.log(err.message);
                })

        } else 
            res.status(200).json({message:"Can't delete image"});

    } catch(err) {
        console.log(err.message);
        res.status(500).json({message:"Server side error"});
    }
};

module.exports = {
    addImageToFirebase,
    getImage,
    getAllImages,
    deleteImage,
};
