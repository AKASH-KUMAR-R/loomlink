
const cron = require('node-cron');
const ImageModel = require('../Model/ImageModel');
const admin = require('../FirebaseConfig/firebaseAdmin');

const bucket = admin.storage().bucket();

const removeExpiredImages = async () => {

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
            })

            console.log(deletedImages);
        }
        
    } catch (error) {
        console.log(error.message);
    }
};

cron.schedule('*/1 * * * *', async () => {
    console.log("Performing scheduled operation");
    await removeExpiredImages();
}); 

module.exports = removeExpiredImages;