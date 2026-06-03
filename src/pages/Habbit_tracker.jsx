import { useEffect, useRef, useState } from "react";
import { addDays, subDays, format, differenceInDays } from "date-fns"
import { GiWeightLiftingUp } from "react-icons/gi";
import { LuGlassWater } from "react-icons/lu";
import { IoFastFoodOutline } from "react-icons/io5";
import Workout from "../components/habbit-comp/workout";
import Water from "../components/habbit-comp/water";
import Dieta from "../components/habbit-comp/dieta";
import "./styles/Habbit_tracker.css"

function Habbit_tracker(){
    const [page, setPage] = useState(0)
    const [date, setDate] = useState(subDays(new Date(), 21))
    const [days, setDays] = useState([])
    const [currentday, setCurrentday] = useState(format(date, "P"))
    const [habbit, setHabbit] = useState(() => {
        const data = localStorage.getItem("habits")
        return data ? JSON.parse(data) : []
    })

    useEffect(() => {
        localStorage.setItem("habits", JSON.stringify(habbit))
        sort_streaks()
    }, [habbit])
    useEffect(() => {
        print_days() 
    }, [])

    const today = useRef(null)
    const iconMap = {
        weights: GiWeightLiftingUp,
        water: LuGlassWater,
        food: IoFastFoodOutline
    }


    function print_days(){
        let week = []
        for(let i = 0; i < 28; i++){
           const day = addDays(date, i)
           const formated_day = format(day, "EEE")
           const formated_month = format(day, "d.M")
           const long_format = format(day, "P")
           week = [...week, {
            day_id: i,
            day: formated_day,
            month: formated_month,
            formated_time: long_format
           }]
           
        }

        setDays(week)
        console.log(days)
    }

    function center_today(){
        setCurrentday(format(new Date(), "P"))
        if(today.current !== null){
            today.current.scrollIntoView({behavior: "smooth", block: "center", inline: "center"})
        }
    }

    function manage_logs(id){
        if(habbit[id].logs.includes(currentday)){
            setHabbit(prevhabit => 
                prevhabit.map(habit => habit.id === id ? {
                    ...habit,
                    logs: habit.logs.filter((day) => day !== currentday)
                } :
                habit
                )    
            )     
        }
        else{
        setHabbit(prevhabits => 
            prevhabits.map(habit => 
                habit.id === id ? {
                    ...habit,
                    logs: [...habit.logs, currentday]
                } : habit
            )
        )
    }
        
    }

    function set_day(currentDay){
        setCurrentday(currentDay)
        console.log(currentDay)
    }

    function sort_streaks(){
        const today = format(new Date(), "P")
        habbit.map((habit, i) => {
            const logs = habbit[i].logs.sort().reverse()
            let streak = 0;
            if(logs[0] !== today){
                habbit.streak = 0;
            }
            else{
                streak = 1;
                for(let i = 0; i < logs.length; i++){
                    if(differenceInDays(logs[i], logs[i + 1]) === 1){
                        streak += 1;
                    }
                    else{
                        break;
                    }
                }
            }
            habbit[i].streak = streak
        })
    }

    return(
        <>
        <div className="header">
            <svg xmlns="http://www.w3.org/2000/svg" height="34px" viewBox="0 -960 960 960" width="34px" fill="#000000"><path d="M480-240q-56 0-107 17.5T280-170v10h400v-10q-42-35-93-52.5T480-240Zm129-59q60 21 111 59v-560H240v560q51-38 111-59t129-21q69 0 129 21ZM437.5-497.5Q420-515 420-540t17.5-42.5Q455-600 480-600t42.5 17.5Q540-565 540-540t-17.5 42.5Q505-480 480-480t-42.5-17.5ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80H240Zm339-361q41-41 41-99t-41-99q-41-41-99-41t-99 41q-41 41-41 99t41 99q41 41 99 41t99-41Zm-99-99Z"/></svg>
            <h1>Habbit tracker</h1>
        </div>

        <div className="today-btn-div">
            <button className = "today-scroll" onClick={() => {center_today()}}>Today</button>  
        </div>

        <div className="dates-row">
            {days.map((day, i) => {
                return(
                    <>
                    <div className = {currentday === day.formated_time ? "on" : "date-box-habit"} id = {day.day_id === 21 ? "today-box": ""}>
                    <label onClick={() => {set_day(day.formated_time)}}>
                        <h3 style = {{fontSize: "22px"}}>{day.day}</h3>
                        <h3 style = {{fontSize: "16px", fontWeight: "300"}}>{day.month}</h3>
                        <div ref = {day.day_id === 21 ? today : null}></div>
                    </label>
                    </div>
                    </>
                )
            })}
        </div>

        <p style = {{marginLeft: "25px", fontWeight: "600", marginTop: "50px"}}>Habits</p>

        <div className="habbits-div">
            {habbit.map((habit, i) => {
                const Icon = iconMap[habit.icon]
                return(
                    <>
                    <div className = {habit.logs.includes(currentday) ? "habit-done" : "habit"} id = {habit.id + i}>
                        <div className="habit-left">
                            <Icon style = {{height: "100%", width: "100%"}}/>
                        </div>                            
                        <div className="habit-center">
                            <h3>{habit.habbit}</h3>
                            <p style = {{fontSize: "14px"}}> item description</p>
                        </div>                    
                        <div className="habit-right">
                            <label onClick={() => {manage_logs(habit.id)}}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#000000"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
                            </label>
                        </div>                    
                    </div>
                    </>
                )
            })}
            <label onClick={() => {sort_streaks()}}>
                <svg xmlns="http://www.w3.org/2000/svg" height="70px" viewBox="0 -960 960 960" width="70px" fill="#ffffff"><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
            </label>
        </div>

        <p style = {{marginLeft: "40px", fontWeight: "600", marginTop: "25px", marginBottom: "20px"}}>Streaks</p>

        <div className="habit-streaks">
            <div>
                {page === 0 && <Workout habits = {habbit[0]}/>}
                {page === 1 && <Water habits = {habbit[1]}/>}
                {page === 2 && <Dieta habits = {habbit[2]}/>}
            </div>
            <div className="streak-picker">
                <label className = {page === 0 ? "streak-label-on" : "streak-label"} onClick={() => {setPage(0)}}>workout</label>
                <label className = {page === 1 ? "streak-label-on" : "streak-label"} onClick={() => {setPage(1)}}>water</label>
                <label className = {page === 2 ? "streak-label-on" : "streak-label"} onClick={() => {setPage(2)}}>dieta</label>
            </div>
        </div>
        <hr />
        </>
    )
}

export default Habbit_tracker;