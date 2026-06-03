import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { add, addDays, format, subDays } from 'date-fns';
import { useEffect, useState } from 'react';

export default function Dieta( {habits} ){
    const day = subDays(new Date(), 7)
        const format_day = format(day, "P")
        const [week, setWeek] = useState([])
    
        useEffect(() => {
            create_week()
        }, [])
    
        function create_week(){
            let arr = []
            for(let i = 0; i <= 7; i++){
                const addday = format(addDays(day, i), "P")
                const addformated_day = format(addDays(day, i), "EEEEE")
                arr = [...arr, {
                    day: addday,
                    day_name: addformated_day
                }
                    ]
            }
            arr.sort().reverse()
            setWeek(arr)
        }
    
        return(
            <>
            {habits.streak === 0 ? <p>nostreak</p> : 
            <>
            <div className='dieta-streak'>
                <DotLottieReact
                src="https://lottie.host/e1eb5227-adba-45ba-8b47-677f17c35231/G6EdT4G97H.lottie"
                loop
                autoplay
                className='fire-icon'
                />
            
            <div className = "streak-stats" > 
                <h3 style = {{ fontSize: "30px"}} className='streak-num'>{habits.streak}</h3>
                <p style = {{fontSize: "18px"}}>days streak</p>
            </div>
            </div>
            <div className='calandar'>
                {week.map((day, i) => {
                    return(
                        <>
                        <div className='calandar-streak'>
                            <p className='calandar-streak-day'>{day.day_name}</p>
                            <p className= {habits.logs.includes(day.day) ? "includes" : "no-includes"}></p>
                        </div>
                        
                        </>
                    )
                })}
            </div>
            </>}
            </>
        )
}