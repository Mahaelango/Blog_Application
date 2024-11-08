import React, { useState, useContext } from 'react';

import { TextField, Box, Button, Typography, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { API } from '../../service/api.js';
import { DataContext } from '../../context/DataProvider';

const Component = styled(Box)`
    width: 400px;
    margin: auto;
    box-shadow: 5px 2px 5px 2px rgb(0 0 0/ 0.6);
`; 

const Image = styled('img')({
    width: 100,
    display: 'flex',
    margin: 'auto',
    padding: '50px 0 0'
});

const Wrapper = styled(Box)`
    padding: 25px 35px;
    display: flex;
    flex: 1;
    overflow: auto;
    flex-direction: column;
    & > div, & > button, & > p {
        margin-top: 20px;
    }
`;

const LoginButton = styled(Button)`
    text-transform: none;
    background: #FB641B;
    color: #fff;
    height: 48px;
    border-radius: 2px;
`; 

const SignupButton = styled(Button)`
    text-transform: none;
    background: #fff;
    color: #2874f0;
    height: 48px;
    border-radius: 2px;
    box-shadow: 0 2px 4px 0 rgb(0 0 0 / 20%);
`;

const Error = styled(Typography)`
    font-size: 10px;
    color: #ff6161;
    line-height: 0;
    margin-top: 10px;
    font-weight: 600;
`
const Text = styled(Typography)`
    color: #878787;
    font-size: 12px;
`;
const loginInitialValues = {
    username: '',
    password: ''
};
const signupInitialValues = {
    name: '',
    username: '',
    password: '',
};

const Login = ({isUserAuthenticated}) =>{

const imageURL = 'https://www.sesta.it/wp-content/uploads/2021/03/logo-blog-sesta-trasparente.png';
    const [login, setLogin] = useState(loginInitialValues);
    const [account,toggleAccount] = useState('login');
    const [signup, setSignup] = useState(signupInitialValues);
    const [error, showError] = useState('');
    const [errors, setErrors] = useState({});
    const { setAccount } = useContext(DataContext);
    const navigate = useNavigate();
    const toggleSignup = () => {
        account === 'signup' ? toggleAccount('login') : toggleAccount('signup');
    }
    const onValueChange = (e) => {
        setLogin({ ...login, [e.target.name]: e.target.value });
    }
    const onInputChange = (e) => {
        setSignup({ ...signup, [e.target.name]: e.target.value });
        
    }
    const loginUser = async () => {
        try {
            let response = await API.userLogin(login);
            if (response?.isSuccess) {
                setErrors(''); 

                sessionStorage.setItem('accessToken', `Bearer ${response.data.accessToken}`);
                sessionStorage.setItem('refreshToken', `Bearer ${response.data.refreshToken}`);
                setAccount({ name: response.data.name, username: response.data.username });

                isUserAuthenticated(true);

                navigate('/');

            } else {
                setErrors('Something went wrong! Please try again later');
            }
        } catch (error) {
            setErrors('Login failed! Please try again later');
            console.error("Login error:", error); // Log the actual error for debugging
        }
    }
       
    const signupUser = async () => {
           // try {
                let response = await API.userSignup(signup);
                if (response?.isSuccess) {
                    // Clear any existing error
                    showError(''); // Uncomment if you're using error state
        
                    // Reset form fields to initial values
                    setSignup(signupInitialValues);
        
                    // Toggle back to login view
                    toggleAccount('login');
                } else {
                    // Set error message in case of failure
                    showError('Something went wrong! Please try again later'); // Uncomment to show error
                    //console.error("Error during signup:", response);
                }
            //} catch (error) {
                // Catch block for any unhandled exceptions from API or network
                //console.error("Signup failed:", error);
              //   showError('Error occurred during signup! Please try again later'); // Uncomment to show error
          //  }
        };
        
    

    return (
        <Component>
            <Box>
                <Image src={imageURL} alt="blog" />
                {
                    account === 'login' ?
                        <Wrapper>
                            <TextField variant="standard" value={login.username} onChange={(e) => onValueChange(e)} name='username' label='Enter Username' />
                            <TextField variant="standard" value={login.password} onChange={(e) => onValueChange(e)} name='password' label='Enter Password' />
                            {error && <Error>{error}</Error>}
                            <LoginButton variant="contained" onClick={() => loginUser()} >Login</LoginButton>
                            <Text style={{ textAlign: 'center' }}>OR</Text>
                            <SignupButton onClick={() => toggleSignup()} style={{ marginBottom: 50 }}>Create an account</SignupButton>
                        </Wrapper>
                         :
                        <Wrapper>
                            <TextField variant="standard" onChange={(e) => onInputChange(e)} name='name' label='Enter Name' />
                            <TextField variant="standard" onChange={(e) => onInputChange(e)}  name='username'label='Enter Username' />
                            <TextField variant="standard" onChange={(e) => onInputChange(e)}   name='password' label='Enter Password' />
                            {error && <Error>{error}</Error>}
                            <SignupButton onClick={() => signupUser()} >Signup</SignupButton>
                            <Text style={{ textAlign: 'center' }}>OR</Text>
                            <LoginButton variant="contained" onClick={() => toggleSignup()}>Already have an account</LoginButton>
                        </Wrapper>
                }
            </Box>
        </Component>
    )
}

export default Login;