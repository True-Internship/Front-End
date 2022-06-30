import React, { useState } from "react";
import Axios from "axios";
import SelectFile from "./SelectFile";
import { Navigate } from "react-router-dom";
import { useNavigate } from 'react-router'
import '../Page/Login.css'
import { MDBInput } from "mdbreact";
import Header from "./Header";
const Login = ({ authenticate }) => {
    const [username, setUserneme] = useState("")
    const [password, setPassword] = useState("")
    const [loginState, setLoginState] = useState("")
    const [check, setcheck] = useState("")
    const navigate = useNavigate();


    const login = () => {
        Axios.post("http://localhost:3001/login", {
            username: username,
            password: password,
        }).then((response) => {
            if (response.data.message) {
                setLoginState(response.data.message)
                setcheck("false")
                navigate("/")
            } else {
                setcheck(true)
                setLoginState(response.data[0].UserName)
                setcheck("true")
                authenticate()
                navigate("/selectfile")

            }

        })
    }
    return (
        <body>
            <div className="container">
                <div className="Login">
                    <div className="header">login</div>
                    <div className="topic-lable">Username</div>

                    <div class="topic-username">
                        <input
                            type="text"
                            class="form-input"
                            autoComplete="off"
                            placeholder=" "
                            onChange={(e) => {
                                setUserneme(e.target.value);
                            }} />
                            <label for="username" class="form--lable">Username</label>
                    </div>

                    <div className="topic-lable">Password</div>
                    <div className="topic-lable">
                        <input
                            type="password"
                            placeholder="password..."
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />
                    </div>
                    <div style={{padding:20}}>
                        <button type="button" class="btn btn-outline-danger"  onClick={login}> button Login</button>
                    </div>

                </div>

            </div>
        </body>

    );

}
export default Login;