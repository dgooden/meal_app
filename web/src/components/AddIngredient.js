import React from "react";
import { useNavigate } from "react-router-dom";

import { createIngredient } from "../fetchData.js";

export default function AddIngredient()
{
    const navigate = useNavigate();

    const [ ingredientData, setIngredientData ] = React.useState(
        {
            "name": "",
            "serving_size": 0,
            "serving_unit": "gram",
            "calories_per_serving": 0
        }
    );

    const [errorData, setErrorData ] = React.useState(
        {
            "code": 0,
            "errorMessage": ""
        }
    );

    function onHandleChange(event)
    {
        const { name, value } = event.target;
        setIngredientData(prevIngredientData => {
            return {
                ...prevIngredientData,
                [name]: value
            }
        });
        console.log(ingredientData);
    }

    function onHandleClear()
    {
        console.log("onHandleClear");
        setIngredientData( () => {
            return {
                "name": "",
                "serving_size": 0,
                "serving_unit": "gram",
                "calories_per_serving": 0
            }
        });
    }

    async function onHandleSubmit(event)
    {
        event.preventDefault();
        let output = await createIngredient(ingredientData);
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
            <h1>Add Ingredient</h1>
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
                <button type="submit">Add Ingredient</button>
                <button type="button" onClick={onHandleClear}>Clear</button>
            </form>
            <div className="error">{ errorData.code > 200 ? errorData.errorMessage : ""}</div>
        </div>
    );
}