import React, { useState } from "react";
import Axios from "axios";
import SelectFile from "./SelectFile";
import { Navigate } from "react-router-dom";
import { useNavigate } from 'react-router'



const Login = ({authenticate}) => {
    const [username, setUserneme] = useState("")
    const [password, setPassword] = useState("")
    const [loginState, setLoginState] = useState("")
    const [check, setcheck] = useState("")
    const navigate = useNavigate();


    const login = () =>{
        Axios.post("http://localhost:3001/login",{
            username:username,
            password:password,
        }).then((response) =>{
            if (response.data.message){
                setLoginState(response.data.message)
                setcheck("false")
                navigate("/")
            }else{
                setcheck(true)
                setLoginState(response.data[0].UserName)
                setcheck("true")
                authenticate()
                navigate("/selectfile")

            }
            
        })
    }
    return (
        <div className="LoginPage">
            <div className="Login">
                <h1>login</h1>
                <input
                    type="text"
                    placeholder="username..."
                    onChange={(e) => {
                        setUserneme(e.target.value);
                    }} />

                <input
                    type="password"
                    placeholder="password..."
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                />
                <button onClick={login}> button Login</button>
            </div>
                    <h1>{loginState}</h1>
                    <h1>{check}</h1>
        </div>
    );
    
}
export default Login;