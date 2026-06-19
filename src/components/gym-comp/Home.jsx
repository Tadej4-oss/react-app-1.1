import { Navigate, Route, Link, useNavigate, redirect, data } from "react-router-dom"
import { signOut } from "firebase/auth";

import "./styles/home.css"
import "./styles/home-sidemenus.css"

import {
    Timestamp,
    getDoc,
    doc, 
    updateDoc,
    collection,
    getDocs,
    orderBy,
    query,
    addDoc, 
    where} 
from "firebase/firestore"

import { auth, db } from "../../firebase";


import { use, useEffect, useState } from "react";
import { subDays, format, addDays, startOfWeek, differenceInDays } from "date-fns";
import Workouts from "./Workouts";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


export default function Home({workouts, setWorkouts}) {
    const [handleWorkout, setHandleWorkout] = useState("")
    const [today, setToday] = useState((format(new Date(), "i")) - 1)
    const [exNames, setExNames] = useState(workouts?.[0]?.exercises?.[0]?.name || "Exercise")
    const [prs, setPrs] = useState([])
    const nav = useNavigate() //look up/learn
    //streaks
    const [logs, setLogs] = useState([])
    const [streakId, setStreakId] = useState("")
    const [dayStreak, setDayStreak] = useState(0)
    //weight
    const [weight, setWeight] = useState([])
    //size
    const [size, setSize] = useState([])



   
    useEffect(() => {
        async function getPrs(){
            const q = query(collection(db, "PersonalRecords"), orderBy("createdAt", "desc"))
            const snap = await getDocs(q)

            let arr = []
            snap.forEach(doc => {


                arr = [...arr, doc.data()]
            })

        setPrs(arr)
        }

        async function getLogs(){
            const snap = await getDocs(collection(db, "Streaks"))
        
            snap.forEach(doc => {
                
                setStreakId(doc.id)
                setLogs(doc.data().logs)
            })
        }

        async function getWeight() {
            const q = query(collection(db, "WeightStats"), orderBy("weight", "desc"))
            const snap = await getDocs(q)

            let arr = []
            snap.forEach(doc => {
                arr = [...arr, doc.data()]
            })

            setWeight(arr)
            
        }

        async function getSize() {
            const q = query(collection(db, "SizeStats"))
            const snap = await getDocs(q)

            let arr = []
            snap.forEach(doc => {
                arr = [...arr, doc.data()]
            })

            setSize(arr)
            
        }

    
    getWeight()
    getPrs()
    getLogs()
    getSize()
    }, [])

    useEffect(() =>{
        function setStreaks(){
        const sorted = logs.sort().reverse()
        const today = format(new Date(), "P")
        if(!sorted.includes(today)){
            setDayStreak(0)
        }
        else{
            let streak = 1
            if(differenceInDays(today, sorted[1]) !== 1){
                setDayStreak(streak)
            }
            else{
                for(let i = 0; i < sorted.length; i++){
                    if(differenceInDays(sorted[i], sorted[i +1],) === 1){
                        streak += 1            
                    }
                    else{
                        break
                    }
                }
            }
            setDayStreak(streak)

            
        }

        
    }

    setStreaks()
    },[logs])

   
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
    }  //look up/learn

    function PRredirect(){
        nav("/gym/PersonalRecords")
    }
   
    async function handleLogs(index){
        let arr = logs
        const day = format(subDays(new Date(), + index), "P")

        if(arr.includes(day)){
            const update = arr.filter((el) => el !== day)
            
            await updateDoc(doc(db, "Streaks", streakId),{
            logs: update
            })

            setLogs(update)
        }
        else{
            arr = [...arr, day]

            await updateDoc(doc(db, "Streaks", streakId),{
            logs: arr
            })

            setLogs(arr)
        }
    }
   

    function trackingRedirect(name){
        nav(`/gym/${name}`)
    }

   
    /////DONT FUCKING DELETEEEE//////  
    if(workouts.length === 0){
        return(
            <>
            <h1>Loading...</h1>
            </>
        )
    }
    /////DONT FUCKING DELETEEEE//////  
   
   
    
    return(
        <>
        
            <input style = {{display: "none"}} id = "change-workout" type = "checkbox" />
            <div className="todays-workout">
                <h2 style={{marginBottom: "10px"}}>Todays Workout</h2>
                <p>{`${workouts[today].day}: ${workouts[today].workout}`}</p> 
            </div>
            <div className="training-plan-text">
                <p style={{display: "flex", alignItems: "center", fontSize: "20px"}}>
                    <svg style={{marginRight: "10px"}} xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#000000"><path d="m826-585-56-56 30-31-128-128-31 30-57-57 30-31q23-23 57-22.5t57 23.5l129 129q23 23 23 56.5T857-615l-31 30ZM346-104q-23 23-56.5 23T233-104L104-233q-23-23-23-56.5t23-56.5l30-30 57 57-31 30 129 129 30-31 57 57-30 30Zm397-336 57-57-303-303-57 57 303 303ZM463-160l57-58-302-302-58 57 303 303Zm-6-234 110-109-64-64-109 110 63 63Zm63 290q-23 23-57 23t-57-23L104-406q-23-23-23-57t23-57l57-57q23-23 56.5-23t56.5 23l63 63 110-110-63-62q-23-23-23-57t23-57l57-57q23-23 56.5-23t56.5 23l303 303q23 23 23 56.5T857-441l-57 57q-23 23-57 23t-57-23l-62-63-110 110 63 63q23 23 23 56.5T577-161l-57 57Z"/>
                    </svg>
                    Your Training Plan
                </p>
                <label htmlFor = "change-workout" style = {{display: "flex", flexDirection: "row"}} >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>
                    <p>change</p>
                </label>
            </div>

            <div className="workoutS">
                {workouts.map((item, i) => {
                    const len = item.exercises.length
                    const resoult = item.exercises.map(el => el.name).join(", ") //look up/learn
                    return(
                        <>
                        <label onClick={() => {redirect(item.id)}}>
                            <div className="workout">
                                <p className = "work-p"style={{
                                                                border: "10px",
                                                                backgroundColor: "#3d3d3d",
                                                                borderRadius: "10px",
                                                                padding: "2px",
                                                                marginBottom: "5px"

                                                                }}>
                                {item.day}</p>
                                <p className = "work-p"style={{fontWeight: "600"}}>{item.workout}</p>
                                <div className= "home-ex" >
                                    {len === 0 ? 
                                    <>
                                    <p className= "home-p">Add Exercise</p>
                                    <p style={{fontSize: "12px"}}>No Exercises</p>
                                    </>
                                    :
                                    <>
                                    <div style={{display: "flex", flexDirection: "row"}}>
                                        <p className= "home-p" >{resoult}</p>
                                        <p style={{textAlign: "center"}}>...</p>
                                    </div>
                                    
                                    <p style={{fontSize: "12px"}}>{`☰ ${len} exercises`}</p>
                                    </>
                                    }
                                    
                                </div>
                            </div>
                            
                        </label>
                        </>
                    )
                })}
            </div>

            
            <div className="PRs" onClick={() => {PRredirect()}}>
                <h1 style = {{color: "#9c6b18"}}>Congrats! Set New PRS </h1>
                <h2>latest:</h2>
                <div className="latest-div">
                    <div style={{marginBottom: "5px", display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                        <p>{prs?.[0]?.name}</p>
                        <p>{prs?.[0]?.logs?.[0]?.weight} kg</p>
                    </div>
                    <hr style = {{margin: "auto", width: "80%"}}/>
                </div>
            </div>

            <div className="gym-tracker">
                <div className="gym-streak">
                    <div id = "gym-left">
                        <h2 style = {{color: "#9c6b18"}}>Streak</h2>
                        <p>{dayStreak} days in a row</p>
                    </div>
                    <div id = "gym-right">
                        <h2>{dayStreak}</h2>
                        <p style={{fontSize: "12px"}}>Days</p>
                    </div>
                </div>
                <div className="gym-week">
                    {workouts.map((el, i) => {
                        const day = format(subDays(new Date(), i) , "eee")
                        const today = format(subDays(new Date(), + i), "P")
                        return(
                            <>
                            <div className="indiv-day">
                                <div className = {logs.includes(today) ? "green" : ""}onClick={() => {handleLogs(i)}}>
                                    
                                </div>
                                <p>{day}</p>
                            </div>
                            </>
                        )
                    })}
                </div>
            </div>
            
            <div className="stats-tracker">
                <div style = {{paddingLeft: "10px", color: " rgb(172, 172, 172)"}}>
                    <h2 style = {{color: "#9c6b18"}}>Body Stats</h2>
                    <p>Tracking progress</p>
                </div>
                
                <div className = "w-s-tracker" >
                    <div onClick={() => {trackingRedirect("Weight")}} className="weight-tracker">
                        <h3 style={{fontWeight: "600"}}>Weight:</h3>
                        <p>{weight?.[0]?.weight} kg</p>
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>
                    </div>
                    <div onClick={() => {trackingRedirect("Size")}}className="size-tracker">
                        <h3 style={{fontWeight: "600"}}>Size:</h3>
                        <p>{`${size?.[0]?.type}: ${size?.[0]?.stats?.[0]?.size} cm`}</p>
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>
                    </div>
                </div>
            </div>
            <button onClick={() => {handleLogout()}}>logout</button>
            <button onClick={() => {console.log(logs)}}>log logs</button>
            <button onClick={() => {console.log(prs)}}>LOGggg</button>
            


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