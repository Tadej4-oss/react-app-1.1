
import {auth, provider } from "../../firebase.js"
import { signInWithPopup } from "firebase/auth";
import Cookies from "universal-cookie"
import "./styles/Auth.css"

function Auth( { setLoggedIn} ){
    const cookies = new Cookies()

    async function signinwithGoogle() {

    try{
        const response = await signInWithPopup(auth, provider);

        cookies.set("uid-cooke", response.user.accessToken)
        setLoggedIn(true)

        //console.log(response)
    }
    catch (error){
        console.log(error)
    }
    finally{
    
    }
    }


    return(
        <>
        <div className="header">
            <h1>Login</h1>
        </div>
        
        <button className = "login-btn" onClick={() => {signinwithGoogle()}}>Login with Google</button>
        </>
    )
}

export default Auth;