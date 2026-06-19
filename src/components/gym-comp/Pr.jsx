import { 
    addDoc,
    collection,
    getDocs,
    query,
    doc,
    updateDoc,
    orderBy,
    serverTimestamp,
    where} 
from "firebase/firestore"


import "./styles/prs.css"
import { db } from "../../firebase"
import { format } from "date-fns"
import { useEffect, useState } from "react"

export default function Pr(){
    const [handleKg, setHandleKg] = useState("")
    const [handleEx, setHandleEx] = useState("")
    const [open, setOpen] = useState(false)
    const [prs, setPrs] = useState([])

    useEffect(() =>{
        getPrs()
    },[])

    useEffect(() =>{
        getPrs()
    },[prs])

    async function getPrs(){
        const q = query(collection(db, "PersonalRecords"), orderBy("createdAt", "desc"))
        const snap = await getDocs(q)

        let arr = []

        snap.forEach(doc =>{
            arr = [...arr, doc.data()]
            
        })

        setPrs(arr)

        console.log(prs)

    }

     async function updatePrs() {
    //    const snap = await getDocs(collection(db, "PersonalRecords")) TO RATA SLABO PR 1000 VEC DOCS, FINE FOR NOW BUT BAD HABBIT

    //   snap.forEach(doc =>{
    //    if(doc.data().name === handleEx){
    //        console.log("found")
    //    }
    //   })

        //correct!
        const q = await query(collection(db, "PersonalRecords"), where("name", "==", handleEx))
        const snap = await getDocs(q)

        if(snap.empty){
            await addDoc(collection(db, "PersonalRecords"), {
            createdAt: serverTimestamp(),
            name: handleEx,
            logs:[{
                weight: handleKg,
                date: format(new Date(), "P"),
            }]
        })
        }
        else{
            const document = snap.docs[0].data()
            const update = [...document.logs, {
                weight: handleKg,
                date: format(new Date(), "P")
            }]

            await updateDoc(doc(db, "PersonalRecords", snap.docs[0].id), {
                logs: update
            })
            
            console.log(update)
           
        }

        setHandleEx("")
        setHandleKg("")
        

    }
    // to funkcijo nastudiri NUJNO (logiko in syntax)
   
    
   
    if(prs.length === 0){  //UX "err" = 0 bo zmeri rendered ce ni se setup PRS (dodaj neki u smislo "no prs: set a Pr")
        return(
            <>
            <h1>No Prs yet</h1>
            <input onChange = {(e) => {setHandleKg(e.target.value)}} placeholder = "Enter Weight" value={handleKg} />       
            <input onChange = {(e) => {setHandleEx(e.target.value)}} placeholder = "Enter Exercise" value={handleEx} /> 
            <button onClick={() => {updatePrs()}}>add</button>
            </>
            
        )
    }

    return(
        <>
        <div className="prs-input">
            <h1>Personal Records</h1>
            
            <input onChange = {(e) => {setHandleKg(e.target.value)}} placeholder = "Enter Weight" value={handleKg} />
            <input onChange = {(e) => {setHandleEx(e.target.value)}} placeholder = "Enter Exercise" value={handleEx} />
            
            <button onClick={() => {updatePrs()}}>add</button>
        </div>
        <h3 style={{marginLeft: "25px"}}>Latest PR`s</h3>
        <div className="pr-box">
            {prs.map((ex, i) => {
                const arr = ex.logs.sort((a, b) => b.weight - a.weight)
                return(
                    <>                    
                    <div className = "indiv-pr" onClick= {() => {setOpen(open === i ? null : i)}} > {/*//ce je open == rowid switch to null(zapre) cene switch to i (odpre i div)*/}
                        <p>{ex.name}</p>
                        <div style={{display: "flex", gap: "12px", alignItems: "center"}}>
                            <p>{ex.logs[0].weight} kg</p>
                            <span style={{ transform: open === i ? "rotate(180deg)" : "rotate(0deg)", transition: "0.3s"}}>
                                ▼
                            </span>
                    </div>
                        
                    </div>
                    <div className={`details ${open === i ? "open": ""}`}>{/* criptic ass shit, mau predebatiri usake tolk */}
                        {arr.map((pr, j) => {
                            return(
                                <>
                                <div className="pr-history">
                                    <p>{pr.weight} kg</p>
                                    <p>{pr.date}</p>
                                    
                                </div>
                                <hr style = {{margin: "auto", width: "80%"}}/>
                                </>

                            )
                        })}
                    </div>  
                    {/* simple version: ce je open set to "id" pol je height 0 cene 300 */}
                    </>
                )
            })}
        </div>
        </>
    )
}