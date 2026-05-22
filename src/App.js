import {useState } from "react"
import Git from "./pages/Git-explorer";
import Chat from "./pages/Chat-app.jsx";
import Finance from "./pages/finance";
import Page3 from "./pages/page3";
import Page4 from "./pages/page4";
import Navbar from "./components/navbar";
import './App.css';

function App(){
    const [page, setPage] = useState(2)

    return(
        <>
        {page === 0 && <Git />}
        {page === 1 && <Chat />}
        {page === 2 && <Finance />}
        {page === 3 && <Page3 />}
        {page === 4 && <Page4 />}
        <Navbar setpage = {setPage}/>
        </>
    )
}

    
    

export default App;
