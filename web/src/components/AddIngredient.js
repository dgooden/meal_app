import React from "react";
import { useNavigate, Link } from "react-router-dom";

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
    }

    function onHandleClear()
    {
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
        <div className="main-container">
            <h1 className="main-header">Add Ingredient</h1>
            <div className="error">{ errorData.code > 200 ? errorData.errorMessage : ""}</div>
            <Link to="/ingredient">Back</Link>
            <form className="add-ingredient-form" onSubmit={onHandleSubmit}>
                <div className="add-ingredient-label">
                    <label htmlFor="name">Name</label>
                </div>
                <div className="add-ingredient-details">
                    <input type="text" id="name" placeholder="Name" onChange={onHandleChange} name="name" value={ingredientData.name}/>
                </div>
                <div className="add-ingredient-label">
                    <label htmlFor="serving_size">Serving size</label>
                </div>
                <div className="add-ingredient-details">
                    <input className="input-ninechar-width"  type="text" id="serving_size" placeholder="0" onChange={onHandleChange} name="serving_size" value={ingredientData.serving_size}/>
                    <select id="serving_unit" onChange={onHandleChange} name="serving_unit" value={ingredientData.serving_unit}>
                        <option value="gram">Grams</option>
                        <option value="ounce">Ounces</option>
                        <option value="teaspoon">Teaspoons</option>
                        <option value="tablespoon">Tablespoons</option>
                    </select>
                </div>
                <div className="add-ingredient-label">
                    <label htmlFor="calories_per_serving">Calories per serving</label>
                </div>
                <div className="add-ingredient-details">
                    <input className="input-ninechar-width" type="text" id="calories_per_serving" placeholder="0" onChange={onHandleChange} name="calories_per_serving" value={ingredientData.calories_per_serving}/>
                </div>
                <div className="add-ingredient-full-width">
                    <button type="submit">Add Ingredient</button>
                    <button type="button" onClick={onHandleClear}>Clear</button>
                </div>
            </form>
        </div>
    );
}