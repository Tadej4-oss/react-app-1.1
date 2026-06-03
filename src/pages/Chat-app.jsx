import { useState } from "react";

import Auth from "../components/chat-comp/Auth";
import Chat from "../components/chat-comp/chat";

import "./styles/Chat-app.css"

import {auth, provider} from "../firebase.js";
import { signInWithPopup, signOut } from "firebase/auth";
import Cookies from "universal-cookie";

function Chat_app(){
    const cookie = new Cookies()
    const user_cookie = cookie.get("uid-cooke")

    const [loggedIn, setLoggedIn] = useState(user_cookie)
    console.log(loggedIn)

    return(
        <>
        {loggedIn ? <Chat setLoggedIn = {setLoggedIn}/> : <Auth setLoggedIn = {setLoggedIn}/>}
        </>
    )
} 

export default Chat_app;