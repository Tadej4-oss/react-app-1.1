import {useState } from "react"
import Git from "./pages/Git-explorer";
import Chat_app from "./pages/Chat-app.jsx";
import Finance from "./pages/finance";
import Habbit_tracker from "./pages/Habbit_tracker";
import Gym from "./pages/Gym";
import Navbar from "./components/navbar";
import './App.css';

function App(){
    const [page, setPage] = useState(2)

    return(
        <>
        {page === 0 && <Git />}
        {page === 1 && <Chat_app />}
        {page === 2 && <Finance />}
        {page === 3 && <Habbit_tracker />}
        {page === 4 && <Gym />}
        <Navbar setpage = {setPage}/>
        </>
    )
    
}

    
    

export default App;
