import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import "./styles/workout-menus.css"
import "./styles/workout.css"
import { updateDoc, doc, getDoc } from "firebase/firestore"
import { db } from "../../firebase"

export default function Workout(){
    const { state } = useLocation()
    const [ex, setEx] = useState([])
    const [handleEx, setHandleEx] = useState("")
    const [searchedEx, setSearchedEx] = useState([])
    console.log(state)
    
    useEffect(() => {
        getEx()
    },[])
    
    const url = `https://edb-with-videos-and-images-by-ascendapi.p.rapidapi.com/api/v1/exercises/search?search=${handleEx}`;
    const options = {
	    method: 'GET',
	    headers: {
	    	'x-rapidapi-key': 'affa64dfe6msh68ca14e00568657p1df118jsn4281cf4047d0',
	    	'x-rapidapi-host': 'edb-with-videos-and-images-by-ascendapi.p.rapidapi.com',
	    	'Content-Type': 'application/json'
	    }
    };

    async function fetchEx() {
        try {
            const response = await fetch(url, options);
	        const result = await response.json();
	        console.log("resoult:", result);
            setSearchedEx(result.data)
        } catch (err) {
            console.error(err);
        }
    }

    async function handleExercise(exer){
        let arr = [...ex, exer]

        await updateDoc(doc(db, "workouts", state.id), {
            exercises: arr
        })
        setEx(arr)
    }

    async function getEx() {
        const data = await getDoc(doc(db, "workouts", state.id))
        
        console.log(data.data().exercises)
        setEx(data.data().exercises)
    }

    if(!state){
        return(
            <>
            <p>loading</p>
            </>
        )
    }
    return(
        <>
        <input style = {{display: "none"}}type = "checkbox" id = "search-menu" />
        <h1 id = "w-day">{state.day}</h1>
        <hr style = {{width: "90%", margin: "auto"}} />
        <p id = "training-day">{state.workout} day</p>
         
        <div className="exercise-list">
            {ex.length === 0 ? (
                <label htmlFor="search-menu">
                    <h1>Add an Exercise</h1>
                </label>) 
                : 
                ( ex.map((el, i) => {
                    return(
                        <>
                        <div className="indiv-ex" key = {i}>
                            <p>{el.name}</p>
                            <img style = {{width: "50px", height: "50px"}}src = {el.imageUrl} alt = "nopic" />
                            <button>RMV</button>
                        </div>
                        </>
                    )
                })
                
                )}

        </div>
        
        <div className="btn-divs">
            <label id = "add-ex" htmlFor="search-menu">
                add ex
            </label>
            <label id = "change-ex" onClick={() => {console.log(ex)}}>
                Change ex
            </label>
        </div>


        
        
        <div className="search-ex">
            <input placeholder = "Search Exercise"value={handleEx} onChange={(e) => {setHandleEx(e.target.value)}}/>
            <button onClick={() => {fetchEx()}}>search</button>
            <div className="test">
                {searchedEx.map((el, i) => {
                    return(
                        <>
                        <p>{el.name}</p>
                        <img style = {{width: "50px", height: "50px"}} src = {el.imageUrl} alt = "nopic" />
                        <button onClick={() => {handleExercise(el)}}>add ex</button>
                        </>
                    )
                })}
            </div>
        </div>
        <label htmlFor="search-menu" id = "ex-overlay"></label>

        </>
    )
}