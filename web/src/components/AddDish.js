import React from "react";
import {Link,useNavigate} from "react-router-dom";

import { createDish } from "../fetchData.js";

export default function AddDish()
{
    const navigate = useNavigate();

    const [ dishData, setDishData ] = React.useState(
        {
            "name": "",
            "total_weight": 0,
            "total_weight_unit": "gram",
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
                "total_weight": 0,
                "total_weight_unit": "gram",
                "ingredients": []
            }
        });
    }

    async function onHandleSubmit(event)
    {
        event.preventDefault();
        const output = await createDish(dishData);
        if ( output.isError ) {
            setErrorData( () => {
                return output.result;
            });
        } else {
            navigate("/dish");
        }
    }

    return (
        <div>
            <h1>Add Dish</h1>
            <Link to="/dish">Back</Link>
            <form onSubmit={onHandleSubmit}>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" value={dishData.name} placeholder="Name" onChange={onHandleChange}/>
                <label htmlFor="total_weight">Total weight</label>
                <input type="text" id="total_weight" name="total_weight" value={dishData.total_weight} placeholder="Total weight" onChange={onHandleChange}/>
                <select id="total_weight_unit" name="total_weight_unit" value={dishData.total_weight_unit} onChange={onHandleChange}>
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