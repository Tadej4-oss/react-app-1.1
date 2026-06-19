import { 
    Timestamp,
    addDoc,
    collection,
    query,
    orderBy,
    getDocs} 
from "firebase/firestore"

import "./styles/weight.css"

import { useEffect, useState } from "react"
import { db } from "../../firebase"
import { format } from "date-fns"

export default function Weight(){
    const [handleWeight, setHandleWeight] = useState("")
    const [stats, setStats] = useState([])

    useEffect(() => {
        getStats()
    },[])

    async function getStats(){
            const q = query(collection(db, "WeightStats"), orderBy("weight", "desc"))
            const snap = await getDocs(q)

            let arr = []
            snap.forEach(doc => {
                arr = [...arr, doc.data()]
            })
            setStats(arr)
    }


    async function addWeight() {
        await addDoc(collection(db, "WeightStats"), {
            Timestamp: Timestamp.fromDate(new Date()),
            date: format(new Date(), "PPpp"),
            weight: handleWeight,

        })
        
        getStats()
        setHandleWeight("")
    }

    

    if(stats.length === 0){
        return(
            <>
            <h1>Loading...</h1>
            </>
        )
    }
    return(
        <>
        <div className="weight-input">
            <input value = {handleWeight} onChange = {(e) => {setHandleWeight(e.target.value)}} placeholder="Enter Weight"/>
            <button onClick={() => {addWeight()}}>add</button>
        </div>

        <div className="weight-stats">
            {stats.map((el, i) => {
                const index = el.date.indexOf(",")
                const resoult = el.date.slice(0, index)
                return(
                    <>
                    <div key={i} className="weight-row" >
                        <p>{el.weight} kgs</p>
                        <p>{resoult}</p>
                    </div>
                    </>
                )
            })}
        </div>
        </>
    )
}