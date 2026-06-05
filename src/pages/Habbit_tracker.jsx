import { useEffect, useRef, useState } from "react";
import { addDays, subDays, format, differenceInDays } from "date-fns"

import { GiWeightLiftingUp } from "react-icons/gi";
import { LuGlassWater } from "react-icons/lu";
import { IoFastFoodOutline } from "react-icons/io5";
import { GrCheckmark } from "react-icons/gr";
import { HiMiniXMark } from "react-icons/hi2";

import { DotLottieReact } from '@lottiefiles/dotlottie-react';

import "./styles/Habbit_tracker.css"
import "./styles/habbit-sidemenu.css"

function Habbit_tracker(){
    const [subWeek, setSubWeek] = useState([])
    const day = subDays(new Date(), 6)
    const [habitAdd, setHabitAdd] = useState("") 
    const [page, setPage] = useState(0)
    const [date, setDate] = useState(subDays(new Date(), 21))
    const [days, setDays] = useState([])
    const [currentday, setCurrentday] = useState(format(date, "P"))
    const [habbit, setHabbit] = useState(() => {
        const data = localStorage.getItem("habits")
        return data ? JSON.parse(data) : []
    })

    const today = useRef(null)
    const iconMap = {
        weights: GiWeightLiftingUp,
        water: LuGlassWater,
        food: IoFastFoodOutline,
        newicon: IoFastFoodOutline
    }

    useEffect(() => {
        localStorage.setItem("habits", JSON.stringify(habbit))
        sort_streaks()
        print_subweek()
    }, [habbit])
    
    useEffect(() => {
        print_days() 
    }, [])

    useEffect(() => {
        center_today()
    }, [days])// the sm rabu dodat days u dependency ker on render je biu ref null na zacetku, kdr se array(days) nafila zalaufa seenkart therefore scrolling into view 


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

    function print_subweek(){
        let arr = []
        for(let i = 0; i <= 6; i++){
            const addday = format(addDays(day, i), "P")
            const addformated_day = format(addDays(day, i), "EEEEE")
            arr = [...arr, {
                day: addday,
                day_name: addformated_day
            }
                ]
        }
        arr.sort().reverse()
        setSubWeek(arr)
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

    function add_habit(){
        setHabbit([...habbit, {
            bestStreak: 0,
            habbit: habitAdd,
            icon: "newicon",
            id: habbit.length,
            logs: [

            ],
            streak: 0
        }])
        setHabitAdd("")
    }

    function remove_habit(id){
        setHabbit(habbit.filter((_,i) => i !== id))
    }


    return(
        <>
        <input  style = {{display: "none"}} id = "habit-remove" type="checkbox" />
        <input style = {{display: "none"}} id = "habit-side-menu" type="checkbox" />
        <div className="habit-header">
            <svg xmlns="http://www.w3.org/2000/svg" height="34px" viewBox="0 -960 960 960" width="34px" fill="#000000"><path d="M480-240q-56 0-107 17.5T280-170v10h400v-10q-42-35-93-52.5T480-240Zm129-59q60 21 111 59v-560H240v560q51-38 111-59t129-21q69 0 129 21ZM437.5-497.5Q420-515 420-540t17.5-42.5Q455-600 480-600t42.5 17.5Q540-565 540-540t-17.5 42.5Q505-480 480-480t-42.5-17.5ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80H240Zm339-361q41-41 41-99t-41-99q-41-41-99-41t-99 41q-41 41-41 99t41 99q41 41 99 41t99-41Zm-99-99Z"/></svg>
            <h1>Habbit tracker</h1>
            <label htmlFor="habit-remove">
                <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000000"><path d="M120-240v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Z"/></svg>
            </label>
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
                        <h3 style = {{fontSize: "16px", fontWeight: "300", textAlign: "center"}}>{day.month}</h3>
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
            <label htmlFor = "habit-side-menu">
                <svg xmlns="http://www.w3.org/2000/svg" height="70px" viewBox="0 -960 960 960" width="70px" fill="#ffffff"><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
            </label>
        </div>

        <p style = {{marginLeft: "40px", fontWeight: "600", marginTop: "25px", marginBottom: "20px"}}>Streaks</p>

        <div className="habit-streaks">
            <div className="carousel">
                {habbit.map((habit, id) => {
                    return(
                        <>
                        <div id = "snap-div"style = {{width: "100px"}}>
                            <div className="streak-top">
                                    {habbit[id].streak === 0 ? <DotLottieReact
                                    src="https://lottie.host/36d0cdee-23ab-4a0c-8822-a94b5815bba5/FcH1QWspIZ.lottie"
                                    autoplay
                                    className='fire-icon'
                                    /> : <DotLottieReact
                                    src="https://lottie.host/e1eb5227-adba-45ba-8b47-677f17c35231/G6EdT4G97H.lottie"
                                    loop
                                    autoplay
                                    className='fire-icon'
                                    />}
                                <div className="streak-stats">
                                    <h3 style = {{ fontSize: "30px"}}>{habbit[id].streak} </h3>
                                    <p style = {{fontSize: "18px"}}>day streak</p>
                                </div>
                            </div>
                            <div className="streak-week">
                                {subWeek.map((day, i) => {
                                    return(
                                        <>
                                        <div className='calandar-streak'>
                                            <p className= {i === 0 ? "main-day" : "calandar-streak-day"}>{day.day_name}</p>
                                            <p className= {habit.logs.includes(day.day) ? "includes" : "no-includes"}>
                                            {habit.logs.includes(day.day) ? // day je object, 2nd day je actual date in the object
                                                <GrCheckmark style={{color: "black"}}/> 
                                                : <HiMiniXMark />}
                                                </p>
                                        </div>
                                        </>
                                    )
                                })}
                            </div>
                            <h1>{habit.habbit}</h1>
                        </div>
                        </>
                    )
                })}
            </div>


        </div>
        <hr />


        {/* add habit sidemenu */}
        <div className="habit-add">
            <label htmlFor= "habit-side-menu" className="habit-overlay">
                <svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill="#000000"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
            </label>
            <h1>Create New Habit</h1>
            <input onChange = {(e) => {setHabitAdd(e.target.value)}}value = {habitAdd}className="habit-input"/>
            <h2>chose and activity</h2>
            <button onClick={() => {add_habit()}}>Add New Habbit</button>
        </div>


        {/* rmv habit sidemenu */}
        <div className="habit-rmv-menu" >
            <label style = {{margin: "10px"}} htmlFor="habit-remove" className="habit-overlay">
                <svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill="#000000"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
            </label>
            <h1 style = {{textAlign: "center"}}>Remove a Habit</h1>
            {habbit.map((habit, i) => {
                return(
                    <>
                    <div className = "habit-rmv-box"id = {i +2}>
                        <p style = {{fontSize: "30px", fontWeight: "600"}}>{habit.habbit}</p>
                        <label onClick={() => {remove_habit(i)}}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill="#000000"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                        </label>
                    </div>
                    </>
                )
            })}
        </div>
    
        </>
    )
}

export default Habbit_tracker;