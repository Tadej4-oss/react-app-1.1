import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { auth, db } from "../../firebase.js";
import Cookies from "universal-cookie";
import { signOut } from "firebase/auth";

function Chat( {setLoggedIn, username}){
    const cookie = new Cookies()

    const [user, setUser] = useState(auth.currentUser.displayName)
    const [avatar, setAvatar] = useState(auth.currentUser.photoURL)
    const [newMessage, setNewMessage] = useState()
    const [messages, setMessages] = useState([])

    const bottomDiv = useRef(null)
    const messageRef = collection(db, "massages")
    //console.log(auth)
    
    useEffect(() => {
        const queryMessages = query(messageRef, orderBy("createdAt"));
        onSnapshot(queryMessages, (snapshot) => {
            let chat = [];
            snapshot.forEach((item) => {
                chat.push({ id: item.id, ...item.data()});
            })
            setMessages(chat)
        })
    }, [])

    useEffect(() => {
        if(bottomDiv.current){
            bottomDiv.current.scrollIntoView({behavior: "smooth"})
        }
    }, [messages])

    async function handleSubmit(e){
        e.preventDefault()
        if(newMessage !== ""){
            try{
                await addDoc(messageRef, {
                    text: newMessage,
                    createdAt: serverTimestamp(),
                    user: auth.currentUser.displayName,
                    photo: auth.currentUser.photoURL,
                    userid: auth.currentUser.uid
                })
            }
            catch(err){
                console.log(err)
            }
            finally{
                setNewMessage("")
            }
        }
        else return;

        
    }

    async function handleLogout() {
        await signOut( auth )
        cookie.remove("uid-cooke")
        setLoggedIn(false)
        
    }

    return(
        <>
        <input style = {{display: "none"}}id = "logout-overlay" type = "checkbox"/>
        <label htmlFor = "logout-overlay" id = "logout-label"></label>
        <div className="chat-header">
            <div style={{textAlign: "center"}}>
                <h2> logged in as:</h2>
                <h1>{user}</h1>
                <img className = "head-avatar" src = {avatar} alt = "nopic"></img>
            </div>
            <label className = "logout-btn-label" htmlFor="logout-overlay">
                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#ffffff"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>
            </label>
        </div>

        <div className="chat">
            {messages.map((msg, i) => {
                const isCurrentuser = msg.userid === auth.currentUser.uid
                return(
                    <div className={isCurrentuser ? "left" : "right"}>
                        <img className={isCurrentuser ? "chat-avatar-left" : "chat-avatar-right"} src = {msg.photo} alt = "no pic"></img>
                        <p className= {isCurrentuser ? "msg-left" : "msg-right"}>{msg.text}</p>
                    </div>
                )
            })}
            <div ref = {bottomDiv}></div>
        </div>

        <form className = "message-input" onSubmit={handleSubmit}>
                <input className = "msg-input" value = {newMessage} onChange ={(e) => {setNewMessage(e.target.value)}} placeholder="type a msg"/>
                <label className = "send-label" htmlFor="send">
                    <button id = "send" className = "send-btn" type = "submit"> Send </button>
                    <svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960" width="40px" fill="#ffffff"><path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/></svg>
                </label>
                
        </form>

        <div className="logout-div">
            <h2 style ={{fontWeight: "500"}}>Logout of User:</h2>
            <h1>{user}</h1>
            <button className = "logout-btn" onClick={() => {handleLogout()}}>Log-out</button>
        </div>


        </>
    )
}

export default Chat;