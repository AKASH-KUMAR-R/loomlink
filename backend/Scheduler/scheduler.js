
const cron = require('node-cron');
const ImageModel = require('../Model/ImageModel');
const admin = require('../FirebaseConfig/firebaseAdmin');

const bucket = admin.storage().bucket();

const removeExpiredImages = async (req, res) => {

    console.log("Cron job begins");
    try {
        const currentTimestamp = new Date();

        console.log(currentTimestamp);
        const filter = {
            $and: [
                { expireAt: { $lte:currentTimestamp } },
                { expireAt: { $exists: true } },
            ]
        };

        const deletedImages = await ImageModel.find(filter);

        if (deletedImages.length > 0) { 

            const deletedStatus = await ImageModel.deleteMany(filter);

            console.log(`${deletedStatus.deletedCount} images deleted from mongoDB`);


            Promise.all(deletedImages.map((eachImage) => bucket.file(eachImage.file_name).delete()))
            .then(() => {
                console.log("Files deleted from firebase");
            }).catch(err => {
                console.log(err.message);
                res.status(505).json({message:"Failed to delete image from firebase"});
            })

            console.log(deletedImages);
        }
        
        res.status(200).json({message:"Image deleted successfully"});
    } catch (error) {
        res.status(505).json({message:"Failed to delete images from firebase"});
        console.log(error.message);
    }

    console.log("cron job ended");
};

cron.schedule('0 * * * *', async () => {
    console.log("Performing scheduled operation");
    await removeExpiredImages();
}); 

module.exports = removeExpiredImages;
