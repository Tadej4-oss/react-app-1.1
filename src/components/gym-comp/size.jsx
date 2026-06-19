import { collection, getDocs, query, updateDoc, where, doc, arrayUnion, addDoc, orderBy } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../../firebase"
import { format } from "date-fns"
import "./styles/size.css"

export default function Size(){
    const [handleSize, setHandleSize] = useState("")
    const [value, setValue] = useState("")
    const [stats, setStats] = useState([])
    const [open, setOpen] = useState(null)

    useEffect(() => {
        getStats()
    }, [])

    async function addData(){
        const q = query(collection(db, "SizeStats"), where("type", "==", value))
        const snap = await getDocs(q)
        let id = null

        
        if(snap.empty){
            //adddoc
            await addDoc(collection(db, "SizeStats"),{
                type: value,
                stats: [{
                    date: format(new Date(), "P"),
                    size: handleSize
                }]
            })
        }
        else{
            //updatedoc
            let arr = []
            snap.forEach(doc => {
                id = doc.id
                arr = doc.data().stats
            })
            

            await updateDoc(doc(db, "SizeStats", id), {
                stats: [...arr, {
                    date: format(new Date(), "P"),
                    size: handleSize
                }]
            })
        }

        getStats()
        setHandleSize("")
    }

    async function getStats() {
        const q = query(collection(db, "SizeStats"))
        const snap = await getDocs(q)
        let arr = []
        snap.forEach(doc => {
            arr = [...arr, doc.data()]
        })
        setStats(arr)
    }

    return(
        <>
        <div className="size-input">
            <select value = {value} onChange = {(e) => {setValue(e.target.value)}} placeholder="Enter Size">
                <option value = "" disabled>Select Part</option>
                <option value = "Waist">Waist</option>
                <option value = "Arms">Arms</option>
                <option value = "Chest">Chest</option>
                <option value = "Legs">Legs</option>
                <option value = "Neck">Neck</option>
            </select>
            <input value = {handleSize} onChange = {(e) => {setHandleSize(e.target.value)}} placeholder="Enter Size"/>
            <button onClick={() =>{addData()}}>add</button>
        </div>

        <div className="size-stats-box">
            {stats?.map((el, i) =>{
                //make in sort arr za date in size za bolsi display
                const arr = el.stats.sort().reverse()

                return(
                    <>
                    <div onClick = {() => {setOpen(open === i ? null : i)}}className="indiv-stat">
                        <p>{el.type}</p>
                        <p>{el.stats[0].size}cm</p>
                        <p>{el.stats[0].date}</p>
                    </div>
                    <div className={`size-details ${open === i ? "open" : ""}`}>
                        {arr.map((el, i) => {
                            return(
                                <>
                                <div className="extra-stats">
                                    <p>{el.size} cm</p>
                                    <p>{el.date}</p>
                                </div>
                                <hr style = {{margin: "auto", width: "80%"}}/>
                                </>
                            )
                        })}
                    </div>
                    </>
                )
            })}
        </div>
        </>
    )
}