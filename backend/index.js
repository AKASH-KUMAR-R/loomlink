require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const ImageRoutes = require('./routes/ImageRoutes');
const UserRoutes = require('./routes/UserRoutes');

const corsOptions = {
    origin: ["https://loomlink.vercel.app"],
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
};

app.use(cors(corsOptions));

mongoose.connect(process.env.MONGO_URL)
.then(() => {

    app.listen(process.env.PORT, () => {
        console.log("Database connected");
    });

})
.catch((e) => {
    console.log(e.message);
});

app.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
});

app.use(express.json());

app.use('/image',ImageRoutes);

app.use('/user',UserRoutes);


