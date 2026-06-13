import { Navigate, Route, Link, useNavigate, redirect } from "react-router-dom"
import { signOut } from "firebase/auth";
import {getDoc, doc, updateDoc, collection, getDocs, orderBy, query} from "firebase/firestore"
import { auth, db } from "../../firebase";
import Cookies from "universal-cookie";
import "./styles/home.css"
import "./styles/home-sidemenus.css"
import { use, useEffect, useState } from "react";
import { format, addDays, startOfWeek } from "date-fns";
import Workouts from "./Workouts";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


export default function Home({workouts, setWorkouts}) {
    const [handleWorkout, setHandleWorkout] = useState("")
    const [today, setToday] = useState(format(new Date(), "i"))
    const nav = useNavigate()

    
    
    async function handleLogout() {
        await signOut(auth)
    }


    async function updateWorkout(index){
        setWorkouts(prev => 
            prev.map((w, i) => w.id === index ? {...w, workout: handleWorkout} : w)
        )

       await updateDoc(doc(db, "workouts", index), {
       workout: handleWorkout,
       })
        
    
    }

    function redirect(index){
        const el = workouts.find(w => w.id === index);
        
        nav(`/gym/workout/${el.id}`, {
            state: el
        })
    }


    function log(){
        console.log("")
    
    }

    return(
        <>
        
            <input style = {{display: "none"}} id = "change-workout" type = "checkbox" />
            <div className="todays-workout">
                <h1>Todays Workout</h1>
                <p>{`${workouts[today].day}: ${workouts[today].workout}`}</p> 
            </div>
            <div className="training-plan-text">
                <p>your training plan</p>
                <label htmlFor = "change-workout" style = {{display: "flex", flexDirection: "row"}} >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>
                    <p>change</p>
                </label>
            </div>
            <div className="workoutS">
                {workouts.map((item, i) => {
                
                    return(
                        <>
                        <label onClick={() => {redirect(item.id)}}>
                            <div className="workout">
                                <p>{item.day}</p>
                                <p>{item.workout}</p>
                                <div style={{marginTop: "30px"}}>
                                    <p style={{fontSize: "10px"}}>exerciss name...</p>
                                    <p style={{fontSize: "10px", marginTop: "5px"}}>☰ number of</p>
                                </div>
                            </div>
                            
                        </label>
                        </>
                    )
                })}
            </div>
            <button onClick={() => {handleLogout()}}>logout</button>
            <button onClick={() => {console.log(workouts)}}>test</button>
            


            {/* configurate workout sidemenu */}
            <div className="change-w-div">
                <label htmlFor="change-workout">
                    <svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill="#000000"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
                </label>
                <div className="workout-modify">
                    {workouts.map((w, i) => {
                        return(
                            <>
                            <p>{`Workout${i + 1}`}</p>
                            <div className="w-modified">
                                <input onChange = {(e) => {setHandleWorkout(e.target.value)}} placeholder={w.workout} />
                                <label onClick = {() => {updateWorkout(w.id)}}className="w-tick">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="55px" viewBox="0 -960 960 960" width="55px" fill="#000000"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
                                </label>
                            </div>
                            </>
                        )
                    })}
                </div>
            </div>
        

        </>
        
    )
}