import { Alert, Button, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, LinearProgress, OutlinedInput, Slide, Snackbar, TextField } from "@mui/material";
import { useContext, useState } from "react";
import EyeCloseIcon from "./Icons/EyeCloseIcon";
import EyeOpenIcon from "./Icons/EyeOpen";
import UserIcon from "./Icons/UserIcon";
import axios from "axios";
import LoginContext from "./Context/LoginContext";
import { useNavigate } from "react-router-dom";


const SignUpPage = () => {

    const [ username, setUsername] = useState("");
    const [ password, setPassword] = useState("");
    const [isLogIn , setIsLogIn] = useState(true);

    const [ showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState(false);
    const [fieldError, setFieldError] = useState({
        name: false,
        pass:false,
    }); 

    const [pending , setPending] = useState(false);
    const [popUp, setPopUp] = useState(false);
    const {loginStatus, setLoginStatus} = useContext(LoginContext);

    const navigate = useNavigate();
    

    const clearInput = () => {
        setUsername("");
        setPassword("");
    };

    const validation = () => {

        setLoginError(false);

        const errors = {};

        if (username.trim() === "") {
            errors.name = true;

        } else {
            errors.name = false;
        }

        if (password.trim() === "") {

            errors.pass = true;

        } else {
            errors.pass = false;
            
        }

        return errors;

    };

    const handleSubmit = async (event) => {

        event.preventDefault();
        const errors = validation();

        setFieldError(errors);

        if (errors.name || errors.pass)
            return;
        
        setPending(true);
        if (isLogIn) {

            try {
                const res = await axios.post('https://loomlink-api.vercel.app/user/login', {
                        username: username,
                        password: password,
                }, {
                    headers: {
                        'Content-Type' : 'application/json',
                    }
                })

                setPopUp(true);
                setLoginStatus(true);
                window.sessionStorage.setItem('user_key', res.data.user_key);
                navigate('/');

            } catch(err) {
                setLoginError(true);
                console.log(err.message);
            } finally {
                setPending(false);            
            }
            

            
        } else {
            
            try {
                const res = await axios.post('https://loomlink-api.vercel.app/user/create', {
                    username: username,
                    password: password,
                }, {
                    headers: {
                        'Content-Type' : 'application/json',
                    },
                });

                console.log(res);
                setPopUp(true);
                clearInput();
            } catch(err) {
                setLoginError(true);
                console.error(err);
            } finally {
                setPending(false);
            }
            
        }

    }

    const handleClosePopUp = () => {
        setPopUp(false);
    }

    return (
        <main className=" w-full min-h-screen bg-zinc-300 flex justify-center items-center">
            <section className=" p-4" style={{display: loginStatus ? 'block' : 'none'}}>
                <h1 className=" text-xl sm:text-2xl text-center">Want to sign in with another account? Log out</h1>
            </section>  
            <section className=" flex flex-col w-full sm:w-[400px] p-4 gap-6" style={{display: loginStatus ? 'none' : 'flex'}}>
                <div className=" flex flex-col items-center font-bold text-xl">
                    <UserIcon /> 
                    {isLogIn ? <span>Log in</span> : <span>Sign up</span>}
                </div>
                {pending && <LinearProgress />}
                <form className=" flex flex-col gap-4" onSubmit={handleSubmit}>
                    {loginError && <span className="  ml-2 text-lg text-red-600">{isLogIn ? "Incorrect username or password" : "User already exist"}</span>}
                    <TextField 
                    placeholder="Email"
                    required 
                    type="email" 
                    label="Username" 
                    variant="outlined" 
                    fullWidth 
                    value={username}
                    error={fieldError.name}
                    helperText= {fieldError.name ? "Enter valid email" : ""}
                    onChange={(event) => {
                        setUsername(event.target.value);
                    }}
                    />
                    <FormControl sx={{flexGrow: 1}}>
                    <InputLabel required htmlFor="password">Password</InputLabel>
                    <OutlinedInput
                    id="password"
                    label="Password"
                    aria-describedby="password-helper-text"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    error={fieldError.pass}
                    onChange={(event) => {
                        setPassword(event.target.value);
                    }}
                    endAdornment= {
                        <InputAdornment position="end">
                            <IconButton
                            aria-label="toggle-password-status"
                            onClick={ () => {
                                setShowPassword(prev => !prev);
                            }}
                            >
                                {showPassword ? <EyeCloseIcon /> : <EyeOpenIcon />}
                            </IconButton>
                        </InputAdornment>
                    }>
                    </OutlinedInput>
                    {fieldError.pass && <FormHelperText id="password-helper-text" className=" text-red-400" style={{
                        color: "red"
                    }}>
                        Enter valid password
                    </FormHelperText>}
                    </FormControl>
                    <Button color="primary" variant="contained" type="submit" fullWidth>{isLogIn ? "Log in": "Sign up"}</Button>
                </form>
                
                <div className=" w-full flex justify-between text-blue-600">
                    {isLogIn && <a href="#forgot" className=" underline">Forgot password?</a>}
                    {isLogIn && <span className=" underline" onClick={() => {
                        setIsLogIn(false);
                        setLoginError(false);}}>Don't have an account? Sign up</span>}
                    {!isLogIn && <span className=" underline" onClick={() => {
                        setIsLogIn(true);
                        setLoginError(false)}}>Already have an account? Log in</span> }
                </div>
            </section>

            <Snackbar
            open={popUp}
            autoHideDuration={2000}
            TransitionComponent={Slide}
            onClose={handleClosePopUp}>
                <Alert severity="success" variant="filled" sx={{width:'100%'}}>
                    {isLogIn ? "Logged in successfully" : "Account created successfully"}
                </Alert>
            </Snackbar>
        </main>
    );
};

export default SignUpPage;