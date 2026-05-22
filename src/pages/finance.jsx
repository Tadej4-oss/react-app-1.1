import React, { useEffect, useState } from "react";
import "./styles/finance.css"

function Finance(){
    const months = ["Jan" ,"Feb", "March", "April", "May", "Jun", "Jul", "Avg", "Sep", "Oct", "Nov", "Dec"]

    const [expense, setExpense] = useState()
    const [amount, setAmount] = useState()
    const [spent, setSpent] = useState()
    const [id, setId] = useState()
    const [item, setItem] = useState()

    const [list, setList] = useState(() => {
        const data = localStorage.getItem("list")
        return data ? JSON.parse(data) : []
    })

    console.log(list, id, item)

    useEffect(() => {
        localStorage.setItem("list", JSON.stringify(list))

        let num = 0
        list.forEach((item) => {
            num += item.value
        })
        setSpent(num)
    }, [list])

    function handleExpense(element){
        setExpense(element.target.value)
    }

    function  handleAmount(element){
        setAmount(element.target.value)
    }

    function addExpense(){
        const time = new Date()

         setList([
            ...list,
            {
            id: list.length,
            expense: expense,
            value: Number(amount),
            day: time.getDate(),
            month: months[time.getMonth() + 1],
            year: time.getFullYear(),
            }
        ])
        setAmount("")
        setExpense("")
        
    }

    function handleDeleteItem(index){
        setId(index)
        setItem(list[index].expense)
    }

    function deleteExpense(){
        setList(list.filter((_,i) => i !== id))
    }
    

    return(
        <>
        <div className="finance-body">
        <input style = {{display: "none"}} type="checkbox" id = "add-expense" />
        <input style = {{display: "none"}} type = "checkbox" id = "remove-btn"></input>

        <label htmlFor = "add-expense" id = "overlay"></label>
        <label htmlFor= "remove-btn" id = "remove-overlay"></label>

        <h1 className="finance-title">
            <svg xmlns="http://www.w3.org/2000/svg" height="34px" viewBox="0 -960 960 960" width="34px" fill="#000000"><path d="M336-120q-91 0-153.5-62.5T120-336q0-38 13-74t37-65l142-171-97-194h530l-97 194 142 171q24 29 37 65t13 74q0 91-63 153.5T624-120H336Zm144-200q-33 0-56.5-23.5T400-400q0-33 23.5-56.5T480-480q33 0 56.5 23.5T560-400q0 33-23.5 56.5T480-320Zm-95-360h190l40-80H345l40 80Zm-49 480h288q57 0 96.5-39.5T760-336q0-24-8.5-46.5T728-423L581-600H380L232-424q-15 18-23.5 41t-8.5 47q0 57 39.5 96.5T336-200Z"/></svg>
            Finance
        </h1>
        <hr></hr>
        
        <div className="spendings-container">
            <p className="spendings-title">Total spent:</p>
            <p className="spendings">${spent}</p>
        </div>

        <div className="list">
            <div className="trans-div">
                <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000000"><path d="M528-120v-66.67h198.67L528-385.33V-478l244.67 244.67V-432H840v312H528ZM246-282.67V-324H121.33v-66.67h245.34V-528H188q-28.33 0-47.5-19.17-19.17-19.16-19.17-47.5V-732q0-28.33 19.17-47.5t47.5-19.17h58V-840h66.67v41.33H434V-732H188v137.33h178.67q28.33 0 47.83 19.17T434-528v137.33q0 28.34-19.5 47.5Q395-324 366.67-324h-54v41.33H246Z"/></svg>
                <h3 style={{display: "flex", alignItems: "center"}}>
                    Tranzakcije
                </h3>
            </div>
            <div className = "tranzakcije-box">
                <hr></hr>
                {list.map((item, id) => {
                    return(
                        <React.Fragment key = {id}>
                            <div className = "expenses-box">
                                <div className = "date-box">
                                    <p style = {{fontWeight: "bold"}}>{item.day}</p>
                                    <p style = {{ fontSize: "12px" }}>{item.month}</p>
                                    <p style = {{ fontSize: "12px" }}>{item.year}</p>
                                </div>
                                <div className="expense-value-box">
                                    <p id = "expense">{item.expense}:</p>
                                    <p id = "value" style = {{fontSize: "22px", color: "red", marginLeft: "20px"}}>-{item.value}$</p>
                                </div>
                                <label className = "x-btn" onClick = {() => {handleDeleteItem(id)}}htmlFor = "remove-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#000000"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                                </label>
                            </div>
                            <hr style = {{margin: "0 10px"}}></hr>
                        </React.Fragment>
                    )
                })}
            </div>
        </div>

        <div className="input-field">
            <label htmlFor = "add-expense">
                <svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill="#000000"><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
            </label>
        </div>

        <div className="box-test">
            I
        </div>
        
        <div className="remove-box">
            <p style = {{textAlign: "center", fontSize: "30px"}}>Delet Expense:</p>
            <p style = {{fontWeight: "700", textAlign: "center", fontSize: "40px", marginBottom: "20px"}}>{item}</p>
            <label id = "remove-label" onClick = {deleteExpense} htmlFor = "remove-btn">
                REMOVE
            </label>
        </div>

        <div className="add-menu">
            <input value = {expense} onChange = {handleExpense} autoComplete = "off" placeholder = "expense" className = "expense-input"id = "expense"type="text" />
            <input value = {amount} onChange = {handleAmount} autoComplete = "off" placeholder = "amount" className = "expense-input"id = "amount"type="text" />
            <button onClick = {() => addExpense()} id = "input-add">ADD</button>
        </div>
        </div>
        </>
    )
}

export default Finance;