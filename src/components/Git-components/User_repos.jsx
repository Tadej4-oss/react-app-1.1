import { useEffect, useState } from "react"
import "./styles/User_repos.css"
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Repo from "./repo";

function User_repos( {setRepo, url, user} ){
    const token = process.env.REACT_APP_API_TOKEN;

    const [repoid, setRepoid] = useState()
    const [repopage, setRepopage] = useState(false)
    const [loading, setLoading] = useState(false)
    const [repos, setRepos] = useState()

    const sliceAt = user.length + 1

    useEffect(() => {
        get_repos()
    }, [])

    async function get_repos(){
        try{
            const response = await fetch(url, {
                headers: {
                    Authorization:  `Bearer ${token}`
                }
            })
            const data = await response.json()

            setRepos(data)
        }
        catch (error){
            console.log(error)
        }
        finally{
            setTimeout(() => {
                setLoading(true)
            }, 1000)
        }
    }

    function handleRepo(id){
        setRepoid(id)
        setRepopage(true)
    }


    return(
        <>
        {!loading && <DotLottieReact
          src="https://lottie.host/99334315-a954-4975-a4e5-eba7f3b68f08/JSu5yISPS2.lottie"
          loop
          autoplay
        />}

        {loading && !repopage && <>
        <label className = "back-arrow" onClick={() => {setRepo(false)}}>
            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000000"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
        </label>

        <div className="repos-header">
            <p>{user}`s</p>
            <p>Repos:</p>
        </div>

        <hr/>
        {repos.map((repo, i) => {
            return(
                <>
                <label onClick={() => {handleRepo(i)}}>
                <div className="repo-box">
                    <div style = {{display: "flex", flexDirection: "column"}}>
                        <p style = {{fontSize: "small", marginBottom: "5px"}}>Name:</p>
                        <p style = {{maxWidth: "260px", overflow: "hidden", fontWeight: "600", textDecoration: "underline"}}>{repo.full_name.slice(sliceAt)}</p>
                    </div>

                    <div style = {{display: "flex", flexDirection: "column", textAlign: "center"}}>
                        <p style = {{fontSize: "small", marginBottom: "5px"}}>Language:</p>
                        <p style = {{fontWeight: "600", textDecoration: "underline"}} >{repo.language}</p>
                    </div>
                </div>
                <label>
                    
                </label>
                </label>
                </>
            )
        })}
        <hr style = {{marginTop: "200px"}}/>
        </>} 

        {repopage && <Repo repoid = {repoid} repos = {repos} setRepopage = {setRepopage}/>}
        </>
    )
}

export default User_repos;