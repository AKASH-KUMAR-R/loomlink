import { useContext, useRef, useState } from "react";
import { ClearIcon } from "./Icons/ClearIcon";
import { Alert, Backdrop, Button, CircularProgress, IconButton, Slide, Snackbar, SnackbarContent } from '@mui/material';
import CopyIcon from './Icons/CopyIcon';
import CopyToClipboard from 'react-copy-to-clipboard';
import axios from 'axios';
import CloudUpLoadIcon from "./Icons/CloudUpLoadIcon";
import LoginContext from "./Context/LoginContext";

const HomePage = () => {

    const [image, setImage] = useState(null);
    const [path, setPath] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    const { loginStatus } = useContext(LoginContext);
    const [warningStatus, setWarningStatus] = useState(!loginStatus);
    const [popUp, setPopUp] = useState(false);

    const fileInputRef = useRef();
    const [pending, setPending] = useState(false);
    const [imagePreviewError, setImagePreviewError] = useState(false);

    const userId = window.sessionStorage.getItem('user_key');


    const handleImageChange = (event) => {

        if (!event.target.files[0])
            return;

        setImageUrl(null);
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = () => {

            const imageDataurl = reader.result;

            setImage(file);
            setPath(imageDataurl);
        };

        reader.onerror = handleFileUploadError;
        reader.readAsDataURL(file);

    }

    const handleUpload = async () => {

        const formData = new FormData();
        formData.append('image', image);

        if (userId)
            formData.append('user_id', userId);

        console.log(userId);

        try {
            setPending(true);
            const res = await axios.post('/image/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log(res.data.image_url);
            setImageUrl(res.data.image_url);

        } catch (error) {
            console.log(error.message);
        } finally {
            setPending(false);
        }

    };

    const clearImage = () => {

        setImage(null);
        setImageUrl(null);
        setPath(null);

        if (fileInputRef.current)
            fileInputRef.current.value = "";

    };

    const handleFileUploadError = (event) => {
        console.log(event.target.error);
        clearImage();
        setImagePreviewError(true);
    }

    return (
        <div className=" flex flex-col items-center  w-full min-h-screen bg-zinc-300">
            <h1 className=" text-4xl font-bold text-center mb-4 mt-8 ">LoomLink</h1>
            <div className=" w-full sm:w-10/12 min-w-[300px] p-4 ">
                <p className=" text-md sm:text-2xl text-center flex flex-col gap-4  opacity-80">
                    <p className=" font-bold text-xl sm:text-3xl opacity-100">Unlock the potential of your images by converting them into clickable links!</p>
                     Our easy-to-use tool allows you to transform any image into a URL, making it easier than ever to share and integrate images across the web.
                </p>
            </div>
            <div className=" w-full sm:w-10/12 flex flex-col gap-4  p-4">
                <div className=" w-full flex gap-4 justify-center">
                    <label htmlFor="image-upload" className=" w-36 h-10 text-white bg-slate-600 rounded-md flex justify-center items-center cursor-pointer">
                        <input
                            type="file"
                            className=" hidden"
                            id="image-upload"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/jpeg, image/png"
                        />
                        <span>Select image</span>
                    </label>

                    {image && <div className=" flex gap-2">
                        <Button
                            variant="contained"
                            color="error"
                            className=" rounded-lg"
                            onClick={clearImage}
                        > <ClearIcon /></Button>
                    </div>}
                </div>

                {imageUrl && <div className=" w-11/12 sm:w-8/12 max-w-[600px] h-10 bg-[#6dddff] rounded-md flex items-center self-center p-4 gap-2">
                    <span className=" font-semibold">Link</span>
                    <a
                        className=" whitespace-nowrap overflow-x-auto underline cursor-pointer"
                        href={imageUrl}
                        target="_blank"
                        rel="noreferrer"
                    >{imageUrl}</a>
                    <CopyToClipboard text={imageUrl} onCopy={() => { setPopUp(true) }}>
                        <IconButton>
                            <CopyIcon />
                        </IconButton>
                    </CopyToClipboard>
                </div>}

                {image && <div className=" flex flex-col justify-center items-center gap-4">
                    {path && <a href={imageUrl} target="_blank" rel="noreferrer" className=" flex justify-center"><img src={path} className=" w-4/12 " alt="preview"></img></a>}
                    <span className=" w-4/12 text-ellipsis whitespace-nowrap overflow-hidden text-center">{image.name}</span>
                    <Button className=" w-40 h-10 flex gap-2 items-center justify-center " style={{
                        backgroundColor: "#ffa500 ",
                        borderRadius: "4px",
                        color: "black",
                    }}
                        onClick={handleUpload}><CloudUpLoadIcon />Upload image</Button>
                </div>}

                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={pending} >
                    <CircularProgress  color="inherit" />
                </Backdrop>
            </div>

            <Snackbar
                open={popUp}
                autoHideDuration={2000}
                onClose={() => { setPopUp(false) }}

                TransitionComponent={Slide}
            >
                <SnackbarContent
                    message="Copied to clipboard"
                    style={{
                        backgroundColor: "#069def"
                    }} />
            </Snackbar>
            <Snackbar
                className=" w-11/12 sm:w-2/3"
                open={warningStatus}
                autoHideDuration={5000}
                onClose={() => { setWarningStatus(false) }}
                TransitionComponent={Slide}
            >
                <Alert severity="warning">Files uploaded without logging in will be automatically deleted after 1 day. For permanent storage and access to your uploads, we recommend creating an account. Thank you!</Alert>
            </Snackbar>

            <Snackbar
                className=" w-11/12 sm:w-2/3"
                open={imagePreviewError}
                autoHideDuration={5000}
                onClose={() => { setImagePreviewError(false) }}
                TransitionComponent={Slide}
            >
                <Alert severity="error">Can't load image</Alert>
            </Snackbar>
        </div>

    );
};

export default HomePage;