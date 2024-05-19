import CopyIcon from "./Icons/CopyIcon";
import DeleteIcon from "./Icons/DeleteIcon";
import { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Button, IconButton, Slide, Snackbar, SnackbarContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CopyToClipboard from "react-copy-to-clipboard";


const ImageGallery = () => {

    const userKey = window.sessionStorage.getItem('user_key');

    const [images, setImages] = useState([]);
    const [popUp, setPopUp] = useState(false);
    const [deletePopup, setDeletePopup] = useState(false);
    
    const navigate = useNavigate();

    const fetchGalleryImages = async () => {
        try {
            const res = await axios.get(`/image/gallery/${userKey}`);

            setImages(res.data.image_urls);
            console.log(res.data.image_urls);
        } catch (err) {
            console.log(err);
        }
    }

    const navigateToUpload = () => {
        navigate('/');
    }

    const handleDelete = async (imageId, index) => {
        try {
            const res = await axios.delete(`/image/delete/${imageId}`);
            setImages( (prev) => {
                const newImages = [ ...prev.slice(0, index), ...prev.slice(index + 1)];

                return newImages;
            });
            
            setDeletePopup(true);
        } catch(err) {
            console.log(err.msssage);
        }
        
    }

    useEffect( () => {
        fetchGalleryImages();
    }, []);

    return (
        <main className=" w-full min-h-screen flex flex-col items-center gap-4 bg-zinc-300" >
            <div className=" w-full bg-slate-400">
                <div className=" flex justify-between p-2 items-baseline gap-3">
                    <h1 className=" text-center text-lg sm:text-2xl font-semibold text-slate-600">ImageGallery</h1>
                    <span>
                        <span className=" border-r-2 border-black pr-1 cursor-pointer mr-2">{images.length} Images</span>
                        <span className=" border-r-2 border-black pr-1 cursor-pointer">{0} Albums</span>
                    </span>
                </div>
            </div>
            {images.length === 0 && <div className=" w-full flex flex-col items-center gap-4 p-4">
                <h1 className=" text-2xl text-center font-semibold">No images found</h1>
                <Button variant="contained" color="primary" onClick={navigateToUpload}>Click here to upload images</Button>
                </div>}
            {(images.length > 0) && <section className=" w-full flex flex-wrap  justify-center gap-4 p-4">
                {images.map((eachImage, index) => (
                    <div 
                        className="image-card relative overflow-hidden h-[300px]  flex items-center shadow-2xl rounded-sm" 
                        key={eachImage.image_id}
                    >
                        <img 
                            src={eachImage.image_url} 
                            width={260} 
                            height={300}  
                            loading="lazy"
                            alt=""
                        />
                        <div className=" bg-[#00649450] rounded-sm absolute bottom-1 left-1 right-1 translate-y-40 transition-transform duration-200 ">
                            <div className=" flex justify-end gap-1">
                                <CopyToClipboard text={eachImage.image_url} onCopy={() => {setPopUp(true)}}>
                                    <IconButton><CopyIcon /></IconButton>
                                </CopyToClipboard>
                                <IconButton onClick={() => {handleDelete(eachImage.image_id, index)}}>
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        </div>
                    </div>
                ))}
                

            </section>}
            <Snackbar
                autoHideDuration={2000}
                open={popUp}
                onClose={() => {setPopUp(false)}}
                TransitionComponent={Slide}
            >
                <SnackbarContent 
                    message="Link copied to clipboard"
                    style={{
                        backgroundColor: "#069def",
                    }}
                />
            </Snackbar>

            <Snackbar
                autoHideDuration={2000}
                open={deletePopup}
                onClose={() => {setDeletePopup(false)}}
                TransitionComponent={Slide}
            >
                <Alert 
                    severity="error" 
                    variant="filled"
                >
                    Image deleted successfully
                </Alert>
            </Snackbar>
        </main>
    );
};

export default ImageGallery;