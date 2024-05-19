import { Alert, AppBar, Box, Button, IconButton, Menu, MenuItem, Slide, Snackbar, Toolbar, Tooltip, Typography } from "@mui/material";
import { Link, useNavigate } from 'react-router-dom';
import Logo from "./Icons/Logo";
import { useContext, useEffect, useRef, useState } from "react";
import LoginContext from "./Context/LoginContext";
import ImagesIcon from "./Icons/ImagesIcon";
import CloudUpLoadIcon from "./Icons/CloudUpLoadIcon";
import MenuIcon from "./Icons/MenuIcon";


const NavBar = () => {

    const navigate = useNavigate();

    const { loginStatus, setLoginStatus } = useContext(LoginContext);
    const [openMenu, setOpenMenu] = useState(false);
    const [popUp, setPopUp] = useState(false);

    const [initialRender, setInitialRender] = useState(false);

    const handleLogout = () => {
        window.sessionStorage.removeItem('user_key');
        setLoginStatus(false);
        navigate('/');
    };

    const handleCloseMenu = () => {
        setOpenMenu(false);
    }

    const navigateToSignUp = () => {
        navigate('/signup');
    };

    const navigateToUpload = () => {
        navigate('/');
    }

    const navigateToGallery = () => {
        navigate('/gallery');
    }


    useEffect(() => {

        if (initialRender) {
            setPopUp(true);
        } else {
            setInitialRender(true);
        }

    }, [loginStatus]);

    return (
        <nav className=" flex w-full">
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="sticky">
                    <Toolbar>
                        <Typography className="h-full flex gap-4 items-center" sx={{ flexGrow: 3 }}>
                            <Link to='/'><Typography className=" font-bold " fontWeight={800} fontSize={28}>LoomLink</Typography></Link>
                            <Logo />
                        </Typography>
                        <div className="flex md:hidden">
                            <Button
                                id="basic-button"
                                variant="text"
                                style={{ color: "black" }}
                                aria-controls={openMenu ? 'basic-menu' : undefined}
                                aria-expanded={openMenu ? 'true' : undefined}
                                onClick={() => { setOpenMenu(prev => !prev) }}>
                                <MenuIcon />
                            </Button>

                            <Menu
                                id="basic-menu"
                                open={openMenu}
                                onClose={handleCloseMenu}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}>
                                <MenuItem onClick={() => {
                                    navigateToUpload();
                                    handleCloseMenu();
                                }}>
                                    <span className=" flex gap-2">Upload<CloudUpLoadIcon /></span>
                                </MenuItem>
                                {loginStatus && <MenuItem onClick={() => {
                                    navigateToGallery();
                                    handleCloseMenu();
                                }}>
                                    <span className=" flex gap-2">Gallery<ImagesIcon /></span>
                                </MenuItem>}
                                <MenuItem onClick={handleCloseMenu}>
                                    {loginStatus ? <Button variant="text" style={{ color: "black", fontWeight: "600" }} onClick={handleLogout}>Log out</Button> : <Button variant="text" style={{ color: "black", fontWeight: "600" }} onClick={navigateToSignUp}>Sign up</Button>}
                                </MenuItem>
                            </Menu>
                        </div>
                        <Typography className=" hidden md:block">
                            <Tooltip title="Upload image"><Button variant="text" style={{ color: "black", gap: "6px" }} onClick={navigateToUpload}>Upload<CloudUpLoadIcon /></Button></Tooltip>
                            {loginStatus && <Tooltip title="Gallery"><Button variant="text" style={{ color: "black", gap: "6px" }} onClick={navigateToGallery}>Gallery<ImagesIcon /></Button></Tooltip>}
                            {loginStatus ? <Button variant="text" style={{ color: "black", fontWeight: "600" }} onClick={handleLogout}>Log out</Button> : <Button variant="text" style={{ color: "black", fontWeight: "600" }} onClick={navigateToSignUp}>
                                Sign up</Button>}
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Box>

            <Snackbar
                open={popUp}
                TransitionComponent={Slide}
                autoHideDuration={6000}
                onClose={() => setPopUp(false)}
            >
                <Alert severity="info" variant="filled" sx={{ width: '100%' }}>{loginStatus ? "Logged in successfully" : "Logout successfully "}</Alert>
            </Snackbar>
        </nav>

    );
};

export default NavBar;