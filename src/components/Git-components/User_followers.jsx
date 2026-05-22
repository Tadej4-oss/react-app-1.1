import { useEffect, useState } from "react"
import "./styles/User_followers.css"
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

function User_followers({setFollowers, url}){
    const [folows, setFolows] = useState(false)
    const [loading, setLoading] = useState()

    const token = process.env.REACT_APP_API_TOKEN;

    useEffect(() => {
        get_Followers()
    }, [])

    async function get_Followers() {
        try{
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await response.json()
            setFolows(data)
        }
        catch (error){
            console.log(error)
        }
        finally{
            setTimeout(() => {
                setLoading(true)
            }, 1000);
        }
        
    }
    return(
        <>
        {!loading && <DotLottieReact
          src="https://lottie.host/99334315-a954-4975-a4e5-eba7f3b68f08/JSu5yISPS2.lottie"
          loop
          autoplay
        />}

        {loading && <>
        <label  onClick={() => {setFollowers(false)}}>
            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000000"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
        </label>
        <h1 style = {{ fontSize: "50px",margin: "20px", textAlign: "center"}}>Followers</h1>
        <hr style = {{ border: "1px solid black", marginLeft: "20px", marginRight: "20px"}}/>
        <div className="followers">
            {folows.map((follower, i) => {
                return(
                    <>
                    <div className="follower">
                        <img style = {{margin: "10px", width: "60px", height: "60px", borderRadius: "50%"}} src = {follower.avatar_url} alt = "nofound"/>
                        <h3 style = {{fontWeight: "500"}}>{follower.login}</h3>
                        <svg  xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill="#000000"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
                    </div>
                    </>
                )
            })}
        </div>
        <hr style = {{marginTop: "200px"}}/>
        </>}
        </>
    )
}

export default User_followers;