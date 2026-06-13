import "./styles/gym.css"
import { Routes, Route,  Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Auth from "../components/gym-comp/gym.auth";
import Home from "../components/gym-comp/Home";
import Workouts from "../components/gym-comp/Workouts";


import {  onAuthStateChanged} from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, getDocs, orderBy, query, snapshotEqual } from "firebase/firestore";

function Gym(){
    const [user, setUser] = useState()
    const [workouts, setWorkouts] = useState([])
    
    

      useEffect(() => {
        const userCred = onAuthStateChanged(auth, (user) => {
            setUser(user)
        })

        async function getWorkouts() {
            const q =  query(
                collection(db, "workouts"),
                orderBy("id")
            )

            let arr = []
            const snap = await getDocs(q)
            snap.forEach(doc => {
                const { day, exercises, id: index, workout } = doc.data();
                arr.push({
                    day,
                    exercises,
                    index,
                    workout,
                    id: doc.id

                })

            })
            
            setWorkouts(arr)        
        }

        getWorkouts()
    }, [])
    
    if(workouts.length === 0){
        return(
            <>
            <h1>Loading...</h1>
            </>
        )
    }

    return(
        <>
        <Routes>
            <Route path= "/login" element = {!user ? <Auth /> : <Navigate to = "/gym"/>}></Route>

            <Route path = "/gym" element = {user ? <Home 
                                                        workouts = {workouts} 
                                                        setWorkouts = {setWorkouts} 
                                                    /> : <Navigate to = "/login" />}></Route>

            <Route path = "/gym/workout/:id" element ={<Workouts />}></Route>
        </Routes>
        </>
    )
}

export default Gym;