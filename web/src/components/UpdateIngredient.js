import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { getIngredient, updateIngredient } from "../fetchData.js";

export default function UpdateIngredient()
{
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state;
    
    const [ ingredientData, setIngredientData ] = React.useState(
        {
            "name": "",
            "serving_size": 0,
            "serving_unit": "gram",
            "calories_per_serving": 0
        }
    );

    const [ errorData, setErrorData ] = React.useState(
        {
            "code": 0,
            "errorMessage": ""
        }
    );

    React.useEffect( () => {
        console.log("useEffect");
        async function getIngredientData()
        {
            const data = await getIngredient(state.uuid);
            setIngredientData(data);
        }
        getIngredientData();
    }, [state.uuid]);

    
    function onHandleChange(event)
    {
        const { name, value } = event.target;
        setIngredientData(prevIngredientData => {
            return {
                ...prevIngredientData,
                [name]: value
            }
        });
    }

    function onHandleSubmit(event)
    {
        event.preventDefault();
        console.log("update ingredient submit");
        const output = updateIngredient(ingredientData);
        if ( output.isError ) {
            setErrorData( () => {
                return output.result;
            });
        } else {
            navigate("/ingredient");
        }
    }

    return (
        <div>
            <h1>Update Ingredient</h1>
            <form onSubmit={onHandleSubmit}>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" placeholder="Name" onChange={onHandleChange} name="name" value={ingredientData.name}/>
                <label htmlFor="serving_size">Serving size</label>
                <input type="text" id="serving_size" placeholder="0" onChange={onHandleChange} name="serving_size" value={ingredientData.serving_size}/>
                <label htmlFor="serving_unit">Serving type</label>
                <select id="serving_unit" onChange={onHandleChange} name="serving_unit" value={ingredientData.serving_unit}>
                    <option value="gram">Grams</option>
                    <option value="ounce">Ounces</option>
                    <option value="teaspoon">Teaspoons</option>
                    <option value="tablespoon">Tablespoons</option>
                </select>
                <label htmlFor="calories_per_serving">Calories per serving</label>
                <input type="text" id="calories_per_serving" placeholder="0" onChange={onHandleChange} name="calories_per_serving" value={ingredientData.calories_per_serving}/>
                <button type="submit">Update Ingredient</button>
            </form>
            <div className="error">{ errorData.code > 200 ? errorData.errorMessage : ""}</div>
        </div>   
    )
}