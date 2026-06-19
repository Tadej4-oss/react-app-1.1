import "./styles/gym.login.css"
import { addDays, format, startOfWeek } from "date-fns"

import { 
    createUserWithEmailAndPassword,
    onAuthStateChanged, 
    signInWithEmailAndPassword
} from "firebase/auth"

import { 
    auth,
    db
} from "../../firebase"

import { 
    addDoc,
    collection
 } from "firebase/firestore"

import { useEffect, useState } from "react"


export default function Auth(){
    const [user, setUser] = useState()
    const [email, setEmail] = useState("")
    const [psw, setPsw] = useState("")


    useEffect(() => {
        const response = onAuthStateChanged(auth, (user) => {
            setUser(user)
         })
        return response
    },[])   

    //console.log(user)

    async function handleSignup(e) {
        e.preventDefault();
        if(psw && email){
            try{
                const userCred = await createUserWithEmailAndPassword(
                auth,
                email,
                psw
                )
                const user = userCred.user

                if(user){
                    const mon = startOfWeek(new Date(), {weekStartsOn: 1})
                    await addDoc(collection(db, "users"), {
                        id: user.uid,
                        email: user.email,
                        createdAt: format(new Date(), "P")

                    })
                    for(let i = 0; i < 7; i++){
                        const day = format(addDays(mon, i), "EEE")
                        await addDoc(collection(db, "workouts"), {
                            id: i,
                            workout: `Add Workout`,
                            day: day,
                            createdAt: format(new Date(), "P"),
                            exercises: [
                        
                            ]
                        })
                    }
                    
                    await addDoc(collection(db, "Streaks"),{
                        streak: 0,
                        bestStreak: 0,
                        logs: [
                            
                        ],
                    })

                    await addDoc(collection(db, "WeightStats"),{
                        
                    })

                    await addDoc(collection(db, "SizeStats"),{
                        
                    })
                    
                }

                    

                }
            catch(err){
                console.log(err)
            }
            finally{
                setEmail("")
                setPsw("")
            }
            
            
        }
        else{
            console.log("notest")
        }
            
    }

    async function handleLogin(e) {
        e.preventDefault()
        try{
            await signInWithEmailAndPassword(auth, email, psw)
        }
        catch(err){
            console.log(err)
        }
        finally{
            setEmail("")
            setPsw("")
        }
            
    }

    return(
        <>
        <div className="login-box">
            <h1 style = {{textAlign: "center"}}>Sign in</h1>
            <form id = "signup-form" onSubmit={handleSignup}>
            <div className="login-div" >
                <div className="email-div">
                    <p style={{marginBottom: "8px"}}>Email Address:</p>
                    <input value = {email} 
                    autoComplete="off"
                    onChange={(e) => {setEmail(e.target.value)}}
                    placeholder = "Enter Your Email Adress" 
                    className="login-input" 
                    id = "email" />
                </div>
                <div className="psw-div">
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                        <p style={{marginBottom: "8px"}}>Password:</p>
                        <p>Forgot password?</p>
                    </div>
                    <input value = {psw}
                    type="password"
                    autoComplete="off"
                    onChange={(e) => {setPsw(e.target.value)}}
                    placeholder = "Enter Your Password" 
                    className="login-input" 
                    id = "psw" />
                </div>
                <button type = "submit" className="gym-login">Sign in</button>
            </div>
            </form>
            <div className="or-div">
                <hr style = {{width: "45%", height: "1px"}}/>
                <p>Or</p>
                <hr style = {{width: "45%", height: "1px"}}/>
            </div>
            <div className="alt-login">
                <label onClick={(e) => {handleLogin(e)}}>
                    <p>Log in</p>
                </label>
            </div>
            <div className="alt-login">
                <label>
                    <p>Continue with google</p>
                </label>
            </div>
            <div className="alt-login">
                Continue with Github
            </div>
            <div className="alt-login">
                Continue with apple
            </div>
            <div>
            </div>
        </div>
        </>
    )
}