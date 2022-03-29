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
        <div className="main-container">
            <h1 className="main-header">Add Dish</h1>
            <Link to="/dish">Back</Link>
            <form className="add-dish-form" onSubmit={onHandleSubmit}>
                <label className="add-dish-form-label" htmlFor="name">Name</label>
                <div className="add-dish-form-item">
                    <div className="add-dish-form-group">
                        <input className="add-dish-input" type="text" id="name" name="name" value={dishData.name} placeholder="Name" onChange={onHandleChange}/>
                    </div>
                </div>
                <label className="add-dish-form-label" htmlFor="total_weight">Total weight</label>
                <div className="add-dish-form-item">
                    <input type="text" id="total_weight" name="total_weight" value={dishData.total_weight} placeholder="Total weight" onChange={onHandleChange}/>
                </div>
                <div className="add-dish-form-extra">
                    <select id="total_weight_unit" name="total_weight_unit" value={dishData.total_weight_unit} onChange={onHandleChange}>
                        <option value="gram">Grams</option>
                        <option value="ounce">Ounces</option>
                    </select>
                </div>
                <div className="add-dish-form-item">
                    <button className="add-dish-button" type="submit">Add Dish</button>
                    <button className="add-dish-button" type="button" onClick={onHandleClear}>Clear</button>
                </div>
            </form>
            <div className="error">{errorData.code > 200 ? errorData.errorMessage  : ""}</div>
        </div>
    );
}