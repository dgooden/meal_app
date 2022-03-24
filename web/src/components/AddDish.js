import React from "react";

import { createDish } from "../fetchData.js";

export default function AddDish()
{
    const [ dishData, setDishData ] = React.useState(
        {
            "name": "",
            "portion": 0,
            "portion_unit": "gram",
            "total_calories": 0,
            "ingredients": []
        }
    );

    const [ errorData, setErrorData ] = React.useState(
        {
            "code": 0,
            "errorMessage": ""
        }
    );

    function onHandleChange(event)
    {
        const { name, value } = event.target;
        setDishData(prevDishData => {
            return {
                ...prevDishData,
                [name]: value
            }
        })
    }

    function onHandleClear()
    {
        // set dish data to empty
        setDishData( () => {
            return {
                "name": "",
                "portion": 0,
                "portion_unit": "gram",
                "total_calories": 0,
                "ingredients": []
            }
        });
    }

    async function onHandleSubmit(event)
    {
        event.preventDefault();
        console.log("dish submit");
        const output = await createDish(dishData);
        if ( output.isError ) {
            setErrorData( () => {
                return output.result;
            });
        }
    }

    return (
        <div>
            <h1>Add Dish</h1>
            <form onSubmit={onHandleSubmit}>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" value={dishData.name} placeholder="Name" onChange={onHandleChange}/>
                <label htmlFor="portion">Portion</label>
                <input type="text" id="porion" name="portion" value={dishData.portion} placeholder="Portion" onChange={onHandleChange}/>
                <select id="portion_unit" name="portion_unit" value={dishData.portion_unit} onChange={onHandleChange}>
                    <option value="gram">Grams</option>
                    <option value="ounce">Ounces</option>
                </select>
                <button type="submit">Add Dish</button>
                <button type="button" onClick={onHandleClear}>Clear</button>
            </form>
            <div className="error">{errorData.code > 200 ? errorData.errorMessage  : ""}</div>
        </div>
    );
}