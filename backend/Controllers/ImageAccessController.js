
const mongoose = require('mongoose');
const cron = require('node-cron');
const {v4: uuid} = require('uuid');

const admin = require('firebase-admin');

const ImageModel = require('../Model/ImageModel');

const serviceAdmin = {
    "type": "service_account",
    "project_id": process.env.PROJECT_ID,
    "private_key_id": process.env.PRIVATE_KEY_ID,
    "private_key": process.env.PRIVATE_KEY,
    "client_email": process.env.CLIENT_EMAIL,
    "client_id": process.env.CLIENT_ID,
    "auth_uri": process.env.AUTH_URL,
    "token_uri": process.env.TOKEN_URL,
    "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.CLIENT_X509_CERT_URL,
    "universe_domain": process.env.UNIVERSE_DOMAIN
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAdmin),
    storageBucket: process.env.STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();

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

                const expireAt = new Date((new Date).getTime() + (24 * 60 * 60 * 1000));
                
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

const removeExpiredImages = async () => {

    try {
        const currentTimestamp = new Date();

        const filter = {
            $and: [
                { expireAt: { $lt:currentTimestamp } },
                { expireAt: { $exists: true } },
            ]
        };

        const deletedImages = await ImageModel.find(filter);
        const deletedStatus = await ImageModel.deleteMany(filter);

        Promise.all(deletedImages.map((eachImage) => bucket.file(eachImage.file_name).delete()))
        .then(() => {
            console.log("Files deleted from firebase");
        }).catch(err => {
            console.log(err.message);
        })

        console.log(deletedImages);

    } catch (error) {
        console.log(error.message);
    }
};

cron.schedule('0 0 * * *', async () => {
    console.log("Performing scheduled operation");
    await removeExpiredImages();
});

module.exports = {
    addImageToFirebase,
    getImage,
    getAllImages,
    deleteImage,
};
